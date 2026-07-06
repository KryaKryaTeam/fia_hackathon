from mlService.worker import process_message

def test_get_pgvector():
    data = {
        "text": "hello",
        "task": "embed",
    }

    result = process_message(data)

    assert result is not None
