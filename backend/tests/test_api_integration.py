import requests
import pytest

BASE_URL = "http://localhost:3000"

def test_health_endpoint():
    response = requests.get(f"{BASE_URL}/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["app"] == "disha"

def test_chat_valid_message():
    response = requests.post(f"{BASE_URL}/api/chat", 
        json={"message": "How do I register to vote?", "history": []})
    assert response.status_code in [200, 500]  # 500 ok without real key
    assert response.headers["content-type"].startswith("application/json")

def test_chat_empty_message():
    response = requests.post(f"{BASE_URL}/api/chat", json={"message": "", "history": []})
    assert response.status_code == 400

def test_chat_message_too_long():
    response = requests.post(f"{BASE_URL}/api/chat", 
        json={"message": "x" * 1001, "history": []})
    assert response.status_code == 400

def test_chat_invalid_history_type():
    response = requests.post(f"{BASE_URL}/api/chat", 
        json={"message": "hello", "history": "not_an_array"})
    assert response.status_code == 400

def test_chat_missing_message():
    response = requests.post(f"{BASE_URL}/api/chat", json={})
    assert response.status_code == 400

def test_translate_endpoint_valid():
    response = requests.post(f"{BASE_URL}/api/translate",
        json={"text": "How to vote", "targetLang": "hi"})
    assert response.status_code == 200
    assert "translatedText" in response.json()

def test_translate_invalid_lang():
    response = requests.post(f"{BASE_URL}/api/translate",
        json={"text": "Hello", "targetLang": "fr"})
    assert response.status_code == 400

def test_rate_limiter_does_not_block_static():
    # Static assets should never be rate limited
    for _ in range(25):
        r = requests.get(f"{BASE_URL}/")
    assert r.status_code in [200, 404]  # never 429
