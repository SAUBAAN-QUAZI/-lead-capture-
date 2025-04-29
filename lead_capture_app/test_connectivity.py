#!/usr/bin/env python
"""
Connectivity test script to verify API connections between environments.

This script tests both local and remote backends to ensure they're accessible
and the OpenAI integrations are working properly.
"""
import requests
import json
import time
import sys
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Configuration
LOCAL_BACKEND = "http://localhost:8000"
PRODUCTION_BACKEND = "https://lead-capture-9mnb.onrender.com"
TEST_MESSAGE = "Hello, this is a connectivity test"
TIMEOUT = 10  # seconds

# Color output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
ENDC = "\033[0m"
BOLD = "\033[1m"

def print_header(text):
    print(f"\n{BOLD}{BLUE}=== {text} ==={ENDC}\n")

def print_success(text):
    print(f"{GREEN}✓ {text}{ENDC}")

def print_error(text):
    print(f"{RED}✗ {text}{ENDC}")

def print_warning(text):
    print(f"{YELLOW}⚠ {text}{ENDC}")

def test_backend(url):
    """Test basic connectivity to a backend"""
    print(f"Testing connectivity to {url}...")
    
    # Test root endpoint
    try:
        start = time.time()
        response = requests.get(f"{url}/", timeout=TIMEOUT)
        duration = time.time() - start
        print_success(f"Connected to root endpoint ({duration:.2f}s)")
    except Exception as e:
        print_error(f"Failed to connect to root endpoint: {str(e)}")
        return False
    
    # Test health endpoint
    try:
        start = time.time()
        response = requests.get(f"{url}/health", timeout=TIMEOUT)
        duration = time.time() - start
        
        if response.status_code == 200:
            health_data = response.json()
            print_success(f"Health check passed ({duration:.2f}s)")
            print(f"  Environment: {health_data.get('environment', 'unknown')}")
            print(f"  Database: {health_data.get('components', {}).get('database', 'unknown')}")
            print(f"  OpenAI API: {health_data.get('components', {}).get('openai_api', 'unknown')}")
        else:
            print_warning(f"Health check returned status {response.status_code}")
            
    except Exception as e:
        print_warning(f"Health check failed: {str(e)}")
    
    # Test OpenAI connection
    try:
        start = time.time()
        response = requests.get(f"{url}/test-openai", timeout=TIMEOUT)
        duration = time.time() - start
        
        if response.status_code == 200:
            openai_data = response.json()
            if openai_data.get("status") == "success":
                print_success(f"OpenAI connection successful ({duration:.2f}s)")
                print(f"  Response: {openai_data.get('response')}")
            else:
                print_error(f"OpenAI connection failed: {openai_data.get('error')}")
        else:
            print_error(f"OpenAI test failed with status {response.status_code}")
            
    except Exception as e:
        print_error(f"OpenAI test failed: {str(e)}")
    
    # Test chat endpoint
    try:
        start = time.time()
        payload = {
            "message": TEST_MESSAGE,
            "conversation_history": []
        }
        response = requests.post(
            f"{url}/chat",
            json=payload,
            timeout=TIMEOUT
        )
        duration = time.time() - start
        
        if response.status_code == 200:
            chat_data = response.json()
            print_success(f"Chat endpoint responded ({duration:.2f}s)")
            print(f"  Message: {chat_data.get('message')[:50]}...")
            if chat_data.get("captured_lead_info"):
                print(f"  Lead info captured: {json.dumps(chat_data.get('captured_lead_info'))}")
        else:
            print_error(f"Chat endpoint failed with status {response.status_code}")
            
    except Exception as e:
        print_error(f"Chat endpoint failed: {str(e)}")
    
    return True

def main():
    print_header("Lead Capture Connectivity Test")
    
    print_header("Local Backend")
    local_ok = test_backend(LOCAL_BACKEND)
    
    print_header("Production Backend")
    prod_ok = test_backend(PRODUCTION_BACKEND)
    
    print_header("Summary")
    if local_ok:
        print_success("Local backend is accessible")
    else:
        print_warning("Local backend is not accessible")
        
    if prod_ok:
        print_success("Production backend is accessible")
    else:
        print_warning("Production backend is not accessible")
    
    if local_ok and prod_ok:
        print_success("All connectivity tests passed!")
        return 0
    else:
        print_warning("Some connectivity tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 