from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

gpt_model = "gpt-4o"

app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) for the app
CORS(app, resources={
    r"/generate_mcqs": {"origins": "http://localhost:3000"},
    r"/generate_mcqs_with_description": {"origins": "http://localhost:3000"},
    r"/verify_mcqs": {"origins": "http://localhost:3000"},
                     })

with open("prompt_resources/mcq_guidelines.txt", "r") as txt_file:
    mcq_guidelines = txt_file.read()

with open("prompt_resources/format.json", "r") as json_file:
    example_format = json_file.read()

with open("prompt_resources/Taxonomy Remember/example.json", "r") as json_file:
    remember_mcqs = json_file.read()

with open("prompt_resources/Taxonomy Understand/example.json", "r") as json_file:
    understand_mcqs = json_file.read()

with open("prompt_resources/Taxonomy Apply/example.json", "r") as json_file:
    apply_mcqs = json_file.read()

with open("prompt_resources/Taxonomy Remember/explanation.txt", "r") as txt_file:
    remember_taxonomy = txt_file.read()

with open("prompt_resources/Taxonomy Understand/explanation.txt", "r") as txt_file:
    understand_taxonomy = txt_file.read()

with open("prompt_resources/Taxonomy Apply/explanation.txt", "r") as txt_file:
    apply_taxonomy = txt_file.read()

with open("prompt_resources/reply_example.json", "r") as json_file:
    reply_example = json_file.read()

def get_temperature(type):
    if (type.lower() == "standard"):
        return 0.1
    if (type.lower() == "creative"):
        return 0.8
    

def get_taxonomy(bloom_taxonomy_level):
    if bloom_taxonomy_level == "Remember":
        return remember_taxonomy,remember_mcqs
    if bloom_taxonomy_level == "Understand":
        return understand_taxonomy,understand_mcqs
    if bloom_taxonomy_level == "Apply":
        return apply_taxonomy, apply_mcqs

# Create a POST API Endpoint to generate MCQs
@app.route("/generate_mcqs", methods=["POST", "OPTIONS"])
def generate_mcqs():
    if request.method == "OPTIONS":
           return '', 200
    data = request.json
    print(data)
    course_name = data.get("fieldOfStudy", "").strip()
    subject_topic = data.get("subject", "").strip()
    num_questions = data.get("sliderValue")
    type = data.get("outputType", "").strip()
    temperature = get_temperature(type)
    bloom_taxonomy_level = data.get("cognitiveLevel","").strip()

    taxonomy,example_mcqs = get_taxonomy(bloom_taxonomy_level)

    prompt_content = f"""
    You are an educational assessment specialist specialized in creating high-quality multiple-choice questions (MCQs) that meet the highest educational standards and goals.

    # Information Provided to you:
    - Field of Study: The broad academic discipline encompassing the subject matter. Use this to set the context and scope for the questions.
    - Subject/Topic: The specific focus within the field of study. Use this to narrow down the content to a particular area that the questions should address.
    - Bloom Taxonomy Level: Defines the cognitive process or skill that the MCQs aim to assess. 

    # Task: 
    Create a JSON list of {num_questions} high-quality multiple-choice questions (MCQs). 
    Ensure the questions align with the Bloom's Taxonomy level.
    Adhere to the specified format, examples and guidelines.

    # JSON Format:
    Ensure each MCQ follows this format:
    {example_format}

    # Bloom's Taxonomy Level to follow:
    {taxonomy}

    ## Example MCQs:
    Use these examples for the '{bloom_taxonomy_level}' level to understand the type and complexity of questions expected for this Bloom's Taxonomy level:
    {example_mcqs}

    # MCQ Guidelines:
    Use these guidelines in addition to the Example MCQs when creating MCQs:
    {mcq_guidelines}
    """
    try:
        # Create & send the request to the GPT API
        response = client.chat.completions.create(
            response_format={"type": "json_object"},
            model=gpt_model,
            messages=[
                {"role": "system", "content": prompt_content},
                {
                    "role": "user",
                    "content": f"""
                    Course Name: {course_name}
                    Subject/Topic: {subject_topic} 
                    Taxonomy: {bloom_taxonomy_level} """
                },
            ],
            temperature=temperature,
            max_tokens=4096,
        )
        result = response.choices[0].message.content.strip()
        print(result)
        mcqs = json.loads(result)  # Parse the Result (make sure it is json)

        return jsonify(mcqs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Create a POST API Endpoint to generate MCQs
@app.route("/generate_mcqs_with_description", methods=["POST", "OPTIONS"])
def generate_mcqs_with_description():
    if request.method == "OPTIONS":
           return '', 200
    data = request.json
    print(data)
    course_name = data.get("fieldOfStudy", "").strip()
    subject_topic = data.get("subject", "").strip()
    num_questions = data.get("sliderValue")
    type = data.get("outputType", "").strip()
    temperature = get_temperature(type)
    bloom_taxonomy_level = data.get("cognitiveLevel","").strip()
    description = data.get("description", "").strip()

    taxonomy,example_mcqs = get_taxonomy(bloom_taxonomy_level)
    
    prompt_content = f"""
    You are an educational assessment specialist specialized in creating high-quality multiple-choice questions (MCQs) that meet the highest educational standards and goals.

    # Information Provided to you:
    - Field of Study: The broad academic discipline encompassing the subject matter. Use this to set the context and scope for the questions.
    - Subject/Topic: The specific focus within the field of study. Use this to narrow down the content to a particular area that the questions should address.
    - Content: Detailed information about the subject/topic, including key concepts and significant details. Restrict your MCQs to the information provided in this content.
    - Bloom Taxonomy Level: Defines the cognitive process or skill that the MCQs aim to assess. 

    # Task: 
    Create a JSON list of {num_questions} high-quality multiple-choice questions (MCQs). 
    Ensure the questions align with the Bloom's Taxonomy level.
    Adhere to the specified format, examples and guidelines.

    # JSON Format:
    Ensure each MCQ follows this format:
    {example_format}

    # Bloom's Taxonomy Level to follow:
    {taxonomy}

    ## Example MCQs:
    Use these examples for the '{bloom_taxonomy_level}' level to understand the type and complexity of questions expected for this Bloom's Taxonomy level:
    {example_mcqs}

    # MCQ Guidelines:
    Use these guidelines in addition to the Example MCQs when creating MCQs:
    {mcq_guidelines}
    """

    try:
        # Create & send the request to the GPT API
        response = client.chat.completions.create(
            response_format={"type": "json_object"},
            model=gpt_model,
            messages=[
                {"role": "system", "content": prompt_content},
                {
                    "role": "user",
                    "content": f"""
                    Course Name: {course_name}
                    Subject/Topic: {subject_topic} 
                    Content: {description}
                    Taxonomy: {bloom_taxonomy_level} """
                },
            ],
            temperature=temperature,
            max_tokens=4096,
        )
        result = response.choices[0].message.content.strip()
        print(result)
        mcqs = json.loads(result)  # Parse the Result (make sure it is json)

        return jsonify(mcqs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Verify MCQs
@app.route("/verify_mcqs", methods=["POST", "OPTIONS"])
def verify_mcqs():
    if request.method == "OPTIONS":
           return '', 200
    data = request.json
    print(data)
    mcqs = data.get("mcqs")
    description = data.get("description", "").strip()
    prompt_content = f"""
                # Role
                I need you to evaluate if a Multiple Choice Question (MCQ) can be answered accurately based only on a provided description. 
                Your task is to determine if the given description contains all the necessary information to solve the MCQ without requiring any prior or general knowledge beyond what is provided in the description.
                
                
                # Instructions
                1. Read the provided description carefully.
                2. Examine the MCQ and its options.
                3. Determine if the description includes all information needed to select the correct answer from the options.
                4. Confirm if no external knowledge (prior knowledge, general knowledge, or assumptions) is needed to answer the question.
                
                # Description
                {description}. 

                If it can be solved, return the ID as key, with a JSON object inside: "TRUE": Quote where the correct answer can be found in the Description
                If it cannot be solved, return the ID as key, with a JSON object inside: "FALSE": "Reason why the MCQ cannot be solved.
                
                Example:
                {reply_example}

                
                """
    
    list = []
    for mcq in mcqs:
        correct_letter = mcq["correct_answer"]
        options = mcq["options"]
        correct_choice = options[correct_letter]
        response = client.chat.completions.create(
        model=gpt_model,
        messages=[
            {
                "role": "system",
                "content": prompt_content
            },
            {
                "role": "user",
                "content": f"""
                ID: {mcq["id"]}
                Question: {mcq["question"]}
                Correct Answer: {correct_choice}
                """
            }
        ],
        temperature=0.5,
        max_tokens=256
        )
        list.append(response.choices[0].message.content)
    
    return list




if __name__ == "__main__":
    app.run(debug=True)
