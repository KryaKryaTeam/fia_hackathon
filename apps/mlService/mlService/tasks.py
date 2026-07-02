from .celery_app import celery

@celery.task(bind=True, autoretry_for=[Exception, ], retry_backoff=True)
def handle_event(event: dict):
    print("Received:", event)

    result = {
        "input": event,
        "prediction": "something",
    }

    print("Result:", result)

    return result