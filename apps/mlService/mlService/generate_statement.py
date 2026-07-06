from google import genai
from google.genai import types
import os 
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GOOGLE_GENAI_USE_ENTERPRISE = os.getenv("GOOGLE_GENAI_USE_ENTERPRISE") == "true"
GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
GOOGLE_CLOUD_LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION")
GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL_NAME")

client = genai.Client(
    enterprise=GOOGLE_GENAI_USE_ENTERPRISE, project=GOOGLE_CLOUD_PROJECT, location=GOOGLE_CLOUD_LOCATION
)

def generate_statement(text, laws_plain, address, location, requester, createdAt):
    laws = ''

    for law in laws_plain:
        laws += f"{law[1]}: {law[2]}\n"

    response = client.models.generate_content(
        model=GEMINI_MODEL_NAME,
        contents = {
            "text": 
f"""
Ти є юридичним помічником, який допомагає громадянам України складати офіційні звернення до органів державної влади або місцевого самоврядування.

На основі наданої інформації склади грамотний, офіційний текст заяви українською мовою.

Використай:
- опис проблеми, наданий заявником;
- інформацію про заявника;
- адресу події;
- дату створення звернення;
- наведені статті Конституції України як правове обґрунтування.

Вимоги:
- Пиши офіційно-діловим стилем.
- Не вигадуй жодних фактів, яких немає у вхідних даних.
- Використовуй лише ті статті Конституції, які були надані.
- Якщо певна стаття не стосується описаної ситуації, не згадуй її.
- Логічно поясни, яким чином наведені статті Конституції стосуються ситуації.
- Наприкінці сформулюй чітке прохання до компетентного органу розглянути звернення, провести перевірку та вжити необхідних заходів.
- Не використовуй Markdown.
- Поверни лише готовий текст звернення без будь-яких пояснень чи коментарів.

Дані звернення:

Дата:
{createdAt}

Заявник:
{"ПІБ: " + requester["fullName"] if requester["fullName"] else ''}
Email: {requester["email"]}
{"Телефон: " + requester["phone"] if requester["phone"] else ''}
{"Адреса заявника: " + requester["address"] if requester["address"] else ''}

Адреса події:
{address}

Координати:
Широта: {location["latitude"]}
Довгота: {location["longitude"]}

Опис проблеми:
{text}

Релевантні статті Конституції України:
{laws}
"""
        },
        config={
            "temperature": 0.7
        }
    )

    return response