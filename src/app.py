import requests
import os
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from flask import Flask, request, jsonify, send_file, render_template
import json
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

def upload_pdf(pdf_path, api_key):
    files = [
        ('file', ('file', open(pdf_path, 'rb'), 'application/octet-stream'))
    ]
    headers = {
        'x-api-key': api_key
    }
    response = requests.post('https://api.chatpdf.com/v1/sources/add-file', headers=headers, files=files)

    if response.status_code == 200:
        return response.json()['sourceId']
    else:
        raise Exception(f"Failed to upload PDF: {response.status_code} - {response.text}")



def read_sources_from_file(file_path):
    with open(file_path, 'r') as file:
        return [line.strip().split(',') for line in file.readlines()]
    
def write_sources_to_file(source_data, file_path):
    with open(file_path, 'w') as file:
        for source_id, book_name in source_data:
            file.write(f"{source_id},{book_name}\n")

def compute_similarity(query, response):
    vectorizer = TfidfVectorizer().fit_transform([query, response])
    vectors = vectorizer.toarray()
    return cosine_similarity([vectors[0]], [vectors[1]])[0][0]

def determine_query_category(query):
    # Basic keyword-based category determination
    personal_development_keywords = [
    "habits","habit", "self-awareness", "growth", "principles", "integrity", "character", 
    "ethics", "self-improvement", "productivity", "efficiency", "management", 
    "leadership", "decision-making", "prioritization", "time management", 
    "empathy", "communication", "listening", "trust", "interdependence", 
    "influence", "synergy", "teamwork", "paradigms", "perception", "attitude", 
    "values", "vision", "purpose", "motivation", "desire", "mindset", 
    "transformation", "continuous improvement", "adaptability", "renewal", 
    "self-discipline", "proactive behavior", "balance", "well-being", 
    "happiness", "fulfillment", "security", "guidance", "wisdom", "power", 
    "life purpose", "truth", "honesty", "courage", "fairness", "responsibility", 
    "personal mission", "self-leadership", "independence","life","depression"
    ]

    
    business_strategy_keywords = ["business", "company", "strategy", "management", "leadership", "market","Hedgehog_Concept", "Level_5_Leadership", "Flywheel", "Doom_Loop",
    "Culture_of_Discipline", "Technology_Accelerators", "First_Who_Then_What",
    "Confront_the_Brutal_Facts", "Stockdale_Paradox", "Great_Companies",
    "Business_Transformation", "Sustained_Greatness", "Leadership",
    "Company_Culture", "Organizational_Change", "Vision", "Strategy",
    "Execution", "Performance", "Innovation"]

    # Initialize scores
    scores = {"Personal Development": 0, "Business Strategies": 0}

    # Count keywords in the query
    for keyword in personal_development_keywords:
        if keyword in query.lower():
            scores["Personal Development"] += 1
    for keyword in business_strategy_keywords:
        if keyword in query.lower():
            scores["Business Strategies"] += 1

    # Determine category with the highest score
    if scores["Personal Development"] > scores["Business Strategies"]:
        return "Personal Development"
    elif scores["Business Strategies"] > scores["Personal Development"]:
        return "Business Strategies"
    else:
        return "General"
    

def query_pdf(source_id, query, api_key):
    headers = {
        'x-api-key': api_key,
        'Content-Type': 'application/json'
    }
    payload = {
        'sourceId': source_id,
        'messages': [
        {
            'role': "user",
            'content': query
        }
    ]
    }
    response = requests.post('https://api.chatpdf.com/v1/chats/message', headers=headers, json=payload)

    if response.status_code == 200:
        return response.json()['content']
    else:
        raise Exception(f"Failed to query PDF: {response.status_code} - {response.text}")


@app.route('/generate_response', methods=['POST'])
def generate_response():
    
    api_key = "sec_xJ86UNfF83CywriPTtJjWh9X6zF9YKKc"
    print(12)
    print(api_key)
    if not api_key:
        print(None)
        return jsonify({"error": "API key not found"}), 500

    pdf_paths = [
        (r'C:\Users\wasam\OneDrive\Desktop\Summer\Files\Good-to-Great.pdf', 'Good to Great'),
        (r'C:\Users\wasam\OneDrive\Desktop\Summer\Files\7-Habits.pdf', 'The 7 Habits of Highly Effective People')
    ]

    book_categories = {
        'Good to Great': 'Business Strategies',
        'The 7 Habits of Highly Effective People': 'Personal Development'
    }

    file_path = 'uploaded_books.txt'
    print(34)
    try:
        if os.path.exists(file_path):
            source_data = read_sources_from_file(file_path)
            source_ids = [data[0] for data in source_data]
            source_id_to_name = {data[0]: data[1] for data in source_data}
        else:
            source_data = []
            for pdf_path, book_name in pdf_paths:
                source_id = upload_pdf(pdf_path, api_key)
                source_data.append((source_id, book_name))

            write_sources_to_file(source_data, file_path)
            source_ids = [data[0] for data in source_data]
            source_id_to_name = {data[0]: data[1] for data in source_data}

        data = request.json
        user_input = data.get("query")
        print(user_input)

        if not user_input:
            return jsonify({"error": "Enter your query!!!"}), 400

        query_category = determine_query_category(user_input)

        most_relevant_response = None
        most_relevant_book_name = None
        highest_score = 0

        for source_id in source_ids:
            try:
                response = query_pdf(source_id, user_input, api_key)

                if response:
                    book_name = source_id_to_name[source_id]
                    book_category = book_categories.get(book_name, "General")

                    score = compute_similarity(user_input, response) + len(response)

                    if book_category == query_category:
                        score *= 3  # Increase score if categories match

                    if score > highest_score:
                        highest_score = score
                        most_relevant_response = response
                        most_relevant_book_name = book_name

            except Exception as query_exception:
                return jsonify({"error": f"Error querying PDF (Source ID: {source_id}): {query_exception}"}), 500

        if most_relevant_response:
            if(most_relevant_book_name == 'The 7 Habits of Highly Effective People'):
                most_relevant_book_name = 'https://ati.dae.gov.in/ati12052021_1.pdf'
            else:
                most_relevant_book_name = 'https://laithaljunaidy.com/books/assets/files/Good-toGreat_WhySomeCompaniesMaketheLeap...AndOthersDontPDFDrive.pdf'

            return jsonify({"reference": most_relevant_book_name, "response": most_relevant_response})
        else:
            return jsonify({"response": "No relevant information found in any of the PDFs."}), 404

    except Exception as e:
        return jsonify({"error": f"Error uploading PDF: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
