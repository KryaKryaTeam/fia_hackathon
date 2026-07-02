import gc
import json
import os
import re
import warnings

import numpy as np
import torch
import tqdm
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
from sentence_transformers import SentenceTransformer

os.environ["PYTORCH_CUDA_ALLOC_CONF"] = "expandable_segments:True"
warnings.filterwarnings("ignore", category=UserWarning)


def parse_law(base_url: str, law_name: str, pages_range: tuple = None):
    """
    Парсер із підтримкою діапазонів сторінок.
    pages_range: наприклад, (1, 50) обробить сторінки з 1 по 50.
    """
    html_contents = []

    urls_to_parse = []
    if pages_range:
        start_page, end_page = pages_range
        clean_url = base_url.split("/page")[0]

        for p_num in range(start_page, end_page + 1):
            if p_num == 1:
                urls_to_parse.append(f"{clean_url}/page")
            else:
                urls_to_parse.append(f"{clean_url}/page{p_num}")
    else:
        urls_to_parse.append(base_url)

    total_urls = len(urls_to_parse)
    print(f"[{law_name}] Створено чергу з {total_urls} сторінок для завантаження.")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."
        )
        page = context.new_page()

        concurrency_limit = 5

        pbar = tqdm.tqdm(
            range(0, total_urls, concurrency_limit), desc=f"[{law_name}] Завантаження"
        )

        for chunk_idx in pbar:
            chunk_urls = urls_to_parse[chunk_idx : chunk_idx + concurrency_limit]

            tabs = []
            for url in chunk_urls:
                page = context.new_page()
                tabs.append((page, url))

                try:
                    page.goto(url, wait_until="commit", timeout=45000)
                except Exception as e:
                    print(f" Помилка старту для {url}: {e}")

            for page, url in tabs:
                try:
                    page.wait_for_load_state("domcontentloaded", timeout=30000)
                    try:  # noqa: SIM105
                        page.wait_for_selector(
                            ".text-missed", state="detached", timeout=10000
                        )
                    except Exception:
                        pass  # Якщо плашки не було або вона зависла — ігноруємо

                    html_contents.append(page.content())
                except Exception as e:
                    print(f"❌ Помилка очікування сторінки {url}: {e}")
                finally:
                    page.close()

        browser.close()

    # Парсимо зібраний HTML за допомогою BeautifulSoup
    articles = []
    current_article_text = []

    print(
        f"[{law_name}] Обробка тексту з {len(html_contents)} завантажених сторінок..."
    )
    for html in html_contents:
        soup = BeautifulSoup(html, "html.parser")

        main_content = soup.find("div", id_="Text")
        if not main_content:
            main_content = soup

        content = main_content.find_all("p")

        for p in content:
            if p.find("a", class_="nav") or p.get("class") in [["nav"], ["hd"]]:
                continue

            text: str = p.get_text(strip=True)
            if not text:
                continue

            is_new_article = text.startswith("Стаття") and re.match(
                r"^Стаття\s+\d+(\-\d+)?\.", text
            )
            if is_new_article and len(text) < 250:
                if len(current_article_text) > 0:
                    combined_text = " ".join(current_article_text)
                    if len(combined_text) > 60:
                        articles.append(combined_text)
                    current_article_text = []
                current_article_text.append(text)
            else:
                if current_article_text:
                    current_article_text.append(text)

    if current_article_text:
        combined_text = " ".join(current_article_text)
        if len(combined_text) > 60:
            articles.append(combined_text)

    articles = list(set(articles))

    if len(articles) > 500:
        anomaly_filename = "anomaly_log.json"
        print(f"⚠️ [Увага] Виявлено аномальну кількість фрагментів ({len(articles)}).")
        print(f"📝 Записуємо приклади фрагментів у {anomaly_filename} для аналізу...")

        anomaly_data = {
            "law_name": law_name,
            "total_fragments_found": len(articles),
            "sample_fragments": articles[:500],
        }

        existing_log = []
        if os.path.exists(anomaly_filename):
            try:
                with open(anomaly_filename, encoding="utf-8") as f:
                    existing_log = json.load(f)
                    if not isinstance(existing_log, list):
                        existing_log = []
            except Exception:
                pass

        existing_log.append(anomaly_data)

        with open(anomaly_filename, "w", encoding="utf-8") as f:
            json.dump(existing_log, f, ensure_ascii=False, indent=4)

        print("🤖 Об'єднуємо фрагменти у великі чанки для безпечного кодування...")
        grouped_articles = []
        for chunk_idx in range(0, len(articles), 15):
            merged_chunk = " ".join(articles[chunk_idx : chunk_idx + 15])
            grouped_articles.append(merged_chunk)
        articles = grouped_articles

    if current_article_text:
        articles.append(" ".join(current_article_text))

    print(f"[{law_name}] Успішно сформовано {len(articles)} статей.\n" + "-" * 40)
    return articles


@torch.no_grad()
def generate_embeddings(texts):
    """Генерація ембедингів з максимальним вивантаженням пам'яті з GPU."""
    print("Завантаження моделі ембедингів у FP16...")
    model = SentenceTransformer(
        "microsoft/harrier-oss-v1-0.6b", model_kwargs={"torch_dtype": torch.float16}
    )

    all_embeddings = []
    chunk_size = 5
    total_texts = len(texts)

    print(f"Розрахунок ембедингів для {total_texts} чанків порціями по {chunk_size}...")

    for i in tqdm.tqdm(range(0, total_texts, chunk_size), desc="Генерація ембедингів"):
        batch_texts = texts[i : i + chunk_size]

        batch_embeds = model.encode(
            batch_texts,
            batch_size=2,
            show_progress_bar=False,
            convert_to_tensor=False,
        )
        all_embeddings.append(batch_embeds)
        torch.cuda.empty_cache()

    final_embeddings = np.vstack(all_embeddings)

    del model
    gc.collect()
    torch.cuda.empty_cache()

    return final_embeddings


def run_final_validation(db_path="laws_database.json"):
    """Автоматичний валідатор бази даних після завершення індексації."""
    if not os.path.exists(db_path):
        print(f"\n❌ [Валідація] Файл {db_path} не знайдено для перевірки!")
        return

    print(f"\n{'=' * 40}\n🔍 [Валідація] Запуск фінальної перевірки бази даних...")

    with open(db_path, encoding="utf-8") as f:
        try:
            db = json.load(f)
        except Exception as e:
            print(f"❌ [Валідація] Помилка читання JSON: {e}")
            return

    items = db.get("items", [])
    total_records = len(items)

    if total_records == 0:
        print("📭 [Валідація] База даних порожня.")
        return

    seen_texts = {}
    seen_articles_per_law = {}

    for item in items:
        law_name = item["law_name"]
        full_text = item["article"]

        seen_texts[full_text] = seen_texts.get(full_text, 0) + 1

        match = re.match(r"^(Стаття\s+\d+(\-\d+)?)", full_text)
        if match:
            article_id = match.group(1)
            if law_name not in seen_articles_per_law:
                seen_articles_per_law[law_name] = {}
            seen_articles_per_law[law_name][article_id] = (
                seen_articles_per_law[law_name].get(article_id, 0) + 1
            )

    text_duplicates = {txt: cnt for txt, cnt in seen_texts.items() if cnt > 1}

    print(f"📊 Разом у базі: {total_records} записів.")

    if text_duplicates:
        print(
            f"❌ УВАГА! Знайдено {len(text_duplicates)} унікальних текстів, які дублюються!"  # noqa: E501
        )
        print(f"   Всього дубльованих рядків у базі: {sum(text_duplicates.values())}")
        print("\n📋 Приклади дублікатів (перші 3):")
        for i, (txt, cnt) in enumerate(text_duplicates.items()):
            if i >= 3:
                break
            print(f'   • Повторюється {cnt} разів: "{txt[:120]}..."')
    else:
        print("✅ ІДЕАЛЬНО: Жодних текстових дублікатів у базі даних не виявлено!")

    print("\n📈 Статистика по документах:")
    for law, articles in seen_articles_per_law.items():
        law_dup_count = sum(1 for art, cnt in articles.items() if cnt > 1)
        total_law_articles = len(articles)

        if law_dup_count > 0:
            print(
                f"   ⚠️ {law}: всього {total_law_articles} унікальних статей, з них {law_dup_count} дублюються номерами."  # noqa: E501
            )
        else:
            print(f"   🔹 {law}: {total_law_articles} статей (чисто, дублікатів немає)")
    print(f"{'=' * 40}\n")


if __name__ == "__main__":
    output_filename = "laws_database.json"

    laws_to_index = [
        {
            "name": "Конституція України",
            "url": "https://zakon.rada.gov.ua/laws/show/254%D0%BA/96-%D0%B2%D1%80?lang=uk",
        },
        {
            "name": "Кримінальний кодекс України",
            "url": "https://zakon.rada.gov.ua/laws/show/2341-14?lang=uk",
        },
        {
            "name": "Кримінальний процесуальний кодекс України",
            "url": "https://zakon.rada.gov.ua/laws/show/4651-17?lang=uk",
        },
        {
            "name": "Кримінально-виконавчий кодекс України",
            "url": "https://zakon.rada.gov.ua/laws/show/1129-15?lang=uk",
        },
        {
            "name": "Цивільний процесуальний кодекс України",
            "url": "https://zakon.rada.gov.ua/laws/show/1618-15?lang=uk",
        },
        {
            "name": "Сімейний кодекс України",
            "url": "https://zakon.rada.gov.ua/laws/main/2947-14?lang=uk",
        },
        {
            "name": "Закон України «Про об'єднання співвласників багатоквартирного будинку»",  # noqa: E501
            "url": "https://zakon.rada.gov.ua/laws/show/2866-14#Text",
        },
        {
            "name": "Закон України «Про особливості здійснення права власності у багатоквартирному будинку»",  # noqa: E501
            "url": "https://zakon.rada.gov.ua/laws/show/417-19#Text",
        },
        {
            "name": "Житловий кодекс України",
            "url": "https://zakon.rada.gov.ua/laws/show/5464-10#Text",
        },
        {
            "name": "Типовий статут об'єднання співвласників багатоквартирного будинку",
            "url": "https://zakon.rada.gov.ua/laws/show/z0923-03",
        },
        {
            "name": "Митний кодекс України",
            "url": "https://zakon.rada.gov.ua/laws/show/4495-17?lang=uk",
        },
        {
            "name": "Кодекс України з процедур банкрутства",
            "url": "https://zakon.rada.gov.ua/laws/show/2597-19?lang=uk",
        },
        {
            "name": "Кодекс законів про працю України",
            "url": "https://zakon.rada.gov.ua/laws/main/322-08?lang=uk",
        },
        {
            "name": "Кодекс адміністративного судочинства України",
            "url": "https://zakon.rada.gov.ua/laws/main/2747-15?lang=uk",
        },
        {
            "name": "Цивільний кодекс України",
            "url": "https://zakon.rada.gov.ua/laws/show/435-15?lang=uk",
        },
        {
            "name": "Земельний кодекс України",
            "url": "https://zakon.rada.gov.ua/laws/show/2768-14?lang=uk",
        },
        {
            "name": "Лісовий кодекс України",
            "url": "https://zakon.rada.gov.ua/laws/main/3852-12?lang=uk",
        },
        {
            "name": "Водний кодекс України",
            "url": "https://zakon.rada.gov.ua/laws/main/213/95-%D0%B2%D1%80?lang=uk",
        },
        {
            "name": "Про надра ( кодекс України про надра )",
            "url": "https://zakon.rada.gov.ua/laws/main/132/94-%D0%B2%D1%80?lang=uk",
        },
        {
            "name": "Виборчий кодекс України",
            "url": "https://zakon.rada.gov.ua/laws/show/396-20?lang=uk",
        },
    ]

    db_structure = {"indexed_laws_summary": [], "items": []}

    if os.path.exists(output_filename):
        print(f"Знайдено існуючу базу {output_filename}. Завантажуємо...")
        with open(output_filename, encoding="utf-8") as f:
            try:
                loaded_data = json.load(f)
                if isinstance(loaded_data, dict) and "items" in loaded_data:
                    db_structure = loaded_data
                elif isinstance(loaded_data, list):
                    db_structure["items"] = loaded_data
                    unique_laws = {}
                    for item in loaded_data:
                        unique_laws[item["law_name"]] = item["url"]
                    db_structure["indexed_laws_summary"] = [
                        {"name": name, "url": url} for name, url in unique_laws.items()
                    ]
            except json.JSONDecodeError:
                print("Файл бази пошкоджений, створюємо новий.")

    indexed_laws = {law["name"] for law in db_structure["indexed_laws_summary"]}

    for idx, law in enumerate(laws_to_index, 1):
        print(f"\n🚀 [{idx}/{len(laws_to_index)}] Обробка: {law['name']}")

        if law["name"] in indexed_laws:
            print(f"⏭️ {law['name']} вже є в базі (згідно з хедером). Пропускаємо.")
            continue

        articles = parse_law(
            law["url"], law["name"], pages_range=law.get("pages_range")
        )
        if not articles:
            print(
                f"⚠️ Не вдалося отримати статті для {law['name']}. Переходимо до наступного."  # noqa: E501
            )
            continue

        try:
            embeddings = generate_embeddings(articles)
        except Exception as e:
            print(f"❌ Помилка генерації ембедингів для {law['name']}: {e}")
            continue

        db_structure["indexed_laws_summary"].append(
            {"name": law["name"], "url": law["url"]}
        )

        # Додаємо статті
        for i, article in enumerate(articles):
            db_structure["items"].append(
                {
                    "law_name": law["name"],
                    "url": law["url"],
                    "article": article,
                    "embedding": embeddings[i].tolist(),
                }
            )

        with open(output_filename, "w", encoding="utf-8") as f:
            json.dump(db_structure, f, ensure_ascii=False, indent=4)

        print(
            f"💾 Базу успішно оновлено! У хедері: {len(db_structure['indexed_laws_summary'])} законів. Разом збережено {len(db_structure['items'])} статей."  # noqa: E501
        )

        del embeddings
        gc.collect()
        torch.cuda.empty_cache()

        if torch.cuda.is_available():
            free_mem, total_mem = torch.cuda.mem_get_info()
            print(
                f" Стан GPU: {free_mem / 1024**3:.2f} GB вільних з {total_mem / 1024**3:.2f} GB"  # noqa: E501
            )

    print("\n🎉 ВСЕ ЗАКОНОДАВСТВО УСПІШНО ПРОІНДЕКСОВАНО!")
    run_final_validation(output_filename)
