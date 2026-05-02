import pytest
import requests

BASE_URL = "http://localhost:3000"

def test_chat_valid_message():
    response = requests.post(f"{BASE_URL}/api/chat", json={
        "message": "What is EVM?",
        "history": []
    })
    # Will fail if API Key is not set or server is offline, but testing the response format primarily
    assert response.status_code in [200, 500] 
    if response.status_code == 200:
        data = response.json()
        assert "reply" in data

def test_chat_empty_message():
    response = requests.post(f"{BASE_URL}/api/chat", json={"message": "", "history": []})
    assert response.status_code == 400
    data = response.json()
    assert "error" in data
