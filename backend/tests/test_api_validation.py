from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_run_rejects_empty_prompt():
    response = client.post("/run", json={"mode": "single", "prompt_a": "", "system_context": ""})
    assert response.status_code == 422


def test_experiments_endpoint_returns_list():
    response = client.get("/experiments")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
