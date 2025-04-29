#!/usr/bin/env python
"""
Test script to validate an OpenAI API key and diagnose connection issues
"""
import os
import sys
import time
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment or command line
api_key = os.getenv("OPENAI_API_KEY")
if len(sys.argv) > 1:
    api_key = sys.argv[1]
    
if not api_key:
    print("ERROR: No API key provided. Set OPENAI_API_KEY or pass as argument")
    sys.exit(1)

print(f"Testing OpenAI API with key starting with: {api_key[:5]}...")

def test_with_openai_package():
    """Test using the OpenAI Python package"""
    try:
        import openai
        client = openai.OpenAI(api_key=api_key)
        
        print("\n=== Testing model list endpoint ===")
        start = time.time()
        models = client.models.list()
        duration = time.time() - start
        print(f"SUCCESS! Found {len(models.data)} models in {duration:.2f} seconds")
        
        print("\n=== Testing chat completion endpoint ===")
        start = time.time()
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Say hi"}],
            max_tokens=5
        )
        duration = time.time() - start
        print(f"SUCCESS! Response: '{response.choices[0].message.content}' in {duration:.2f} seconds")
        return True
    except Exception as e:
        print(f"ERROR with OpenAI package: {type(e).__name__}: {str(e)}")
        return False

def test_with_httpx():
    """Test using direct HTTPX calls"""
    try:
        print("\n=== Testing direct API call with HTTPX ===")
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        data = {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": "Say hi"}],
            "max_tokens": 5
        }
        
        start = time.time()
        response = httpx.post(url, json=data, headers=headers, timeout=30.0)
        duration = time.time() - start
        
        if response.status_code == 200:
            result = response.json()
            print(f"SUCCESS! Response: '{result['choices'][0]['message']['content']}' in {duration:.2f} seconds")
            return True
        else:
            print(f"ERROR: Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"ERROR with HTTPX: {type(e).__name__}: {str(e)}")
        return False

def test_network_connectivity():
    """Test general network connectivity"""
    print("\n=== Testing general network connectivity ===")
    
    # List of key domains to test
    test_domains = [
        "api.openai.com",
        "google.com",
        "httpbin.org"
    ]
    
    for domain in test_domains:
        try:
            start = time.time()
            response = httpx.get(f"https://{domain}", timeout=5.0)
            duration = time.time() - start
            print(f"✓ {domain}: Status {response.status_code} in {duration:.2f}s")
        except Exception as e:
            print(f"✗ {domain}: {type(e).__name__}: {str(e)}")

# Run tests
test_network_connectivity()
openai_result = test_with_openai_package()
httpx_result = test_with_httpx()

# Summarize results
print("\n=== Summary ===")
print(f"Network Connectivity: Tested")
print(f"OpenAI Package Test: {'SUCCESS' if openai_result else 'FAILED'}")
print(f"Direct HTTPX Test: {'SUCCESS' if httpx_result else 'FAILED'}")

if not openai_result and not httpx_result:
    print("\nTROUBLESHOOTING:")
    print("1. Check if your API key is valid and not expired")
    print("2. Verify if there are network restrictions (firewall, proxy)")
    print("3. Try running this on a different network (e.g., mobile hotspot)")
    print("4. Check if OpenAI service is experiencing outages")
    print("5. Your API key might have regional restrictions")
    sys.exit(1)
else:
    print("\nAt least one test succeeded! Your API key is working.")
    sys.exit(0) 