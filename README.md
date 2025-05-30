# A Comprehensive Framework for AI-Driven Multiple-Choice Question Generation with Cognitive Taxonomy Alignment and Minimal Item-Writing Flaws

This repository contains the implementation of a comprehensive framework for generating high-quality multiple-choice questions (MCQs) using GPT-4o. The system is designed to automate the creation of MCQs with minimal item-writing flaws (IWFs), targeting the first three levels of Bloom’s Taxonomy: Remembering, Understanding, and Applying.

## Demonstration

https://github.com/user-attachments/assets/24fc0011-dbb8-4bd8-92b2-b4cf3c19fa5a


## Key Features

- **Prompt Engineering Integration**: Utilizes few-shot, chain-of-thought and RAG prompting with tailored patterns (Persona, Template, Context Manager).
- **Bloom’s Taxonomy Alignment**: Supports cognitive level targeting to improve assessment quality and educational relevance.
- **Item-Writing Flaw Detection**: Incorporates an enhanced version of the [SAQUET](https://github.com/StevenJamesMoore/SAQUET) evaluation tool to automatically identify 19 known MCQ flaws.
- **Model-Agnostic Design**: Optimized for GPT-4o, but adaptable to other LLMs.
- **Interactive Web Interface**: Includes a simple UI to guide users through content entry and question generation.

## Item-Writing Flaws

An item-writing flaw in a multiple-choice question is a defect—such as ambiguous wording, implausible distractors, or unintended clues—that undermines the validity and fairness of the assessment by making questions easier or harder for reasons unrelated to actual knowledge.

| **Item-Writing Flaw**       | **An Item Is Flawed If...** |
|-----------------------------|------------------------------|
| Longest Option Correct      | The correct option is noticeably longer (>25%) and includes more detailed information than the other distractors, which may clue students to this option. |
| Ambiguous Information       | The question text or any of the options are written in an unclear way that includes ambiguous language. |
| Implausible Distractors     | Any included distractors are implausible, as good items depend on having effective distractors. |
| True or False               | The options are a series of true/false statements. |
| Absolute Terms              | It contains the use of absolute terms (e.g., never, always, all) in the question text or options. |
| Complex or K-type           | It contains a range of correct responses that ask students to select from a number of possible combinations of the responses. |
| Negatively Worded           | The question text is negatively worded, which can confuse students and is less likely to measure important learning outcomes. |
| Convergence Cues            | Convergence cues are present in the options, where there are different combinations of multiple components to the answer. |
| Lost Sequence               | The options are not arranged in chronological or numerical order. |
| Unfocused Stem              | The stem is not a clear and focused question that can be understood and answered without looking at the options. |
| None of the Above           | One of the options is “none of the above”, which only measures students’ ability to detect incorrect answers. |
| Word Repeats                | The question text and correct response contain words only repeated between the two. |
| More Than One Correct       | There is not a single best answer, as there should be only one. |
| Logical Cues                | It contains clues in the stem and the correct option that can help the test-wise student identify the correct answer. |
| All of the Above            | One of the options is “all of the above”, as students can guess correct responses based on partial information. |
| Fill in the Blank           | The question text omits words in the middle of the stem that students must insert from the options provided. |
| Vague Terms                 | It uses vague terms (e.g., frequently, occasionally) in the options, as there is seldom agreement on their actual meaning. |
| Grammatical Cues            | All options are not grammatically consistent with the stem; options should be parallel in style and form. |
| Gratuitous Information      | It contains unnecessary information in the stem that is not required to answer the question. |



## Evaluation Highlights

- The AI-driven Framework is able to avoid 91.07% of potential IWFs in the generated MCQs, demonstrating the framework's effectiveness in producing high-quality questions.
- Only 4.6% of 6,840 potential IWFs were detected across 360 questions.
- 96% of MCQs were manually judged solvable and contextually aligned.
- Adjusted flaw rate (accounting for tool accuracy): 91.07% flaw avoidance.

## Results

- A total of 360 MCQs were generated by the framework across various subjects and difficulty levels.
- Of these, 284 MCQs (78.9%) were judged to be of high quality based on contextual relevance, cognitive alignment, and clarity.
- Among the high-quality questions, 167 MCQs (58.8% of the high-quality subset) contained no detectable item-writing flaws, indicating a strong correlation between prompt design and output quality.
- The remaining 117 high-quality MCQs contained only minor or single-instance flaws, most of which were not pedagogically significant.
- These results highlight the framework’s practical viability in reducing manual workload for educators while maintaining consistent assessment standards.

## Applications

This framework is intended for educational researchers, instructional designers, and developers looking to integrate AI-assisted question generation into e-learning platforms or assessment tools.

## Implementation 

The backend is implemented using Flask, serving as the API layer that handles prompt assembly, interaction with the GPT-4o model, and MCQ generation logic. This framework automates the generation of multiple-choice questions targeting the first three levels of Bloom's Taxonomy—Remembering, Understanding, and Applying—while minimizing common item-writing flaws using advanced prompt engineering techniques. Additionally, the solvability of each MCQ can be verified once the Questions are generated, ensuring that the MCQs are based on the given description and context.

The frontend is implemented using React and provides a user-friendly interface for inputting content, configuring generation settings, and displaying the resulting MCQs. It communicates with the Flask backend via RESTful API calls, allowing users to interactively generate, review, and verify MCQs. The interface includes fields for specifying question topics, cognitive levels, and source content, as well as features for visualizing solvability results. This seamless integration ensures that non-technical users can efficiently leverage the full capabilities of the underlying AI framework.

## SAQUET Tool Enhancements

To improve the accuracy and reliability of flaw detection in multiple-choice questions, the original SAQUET evaluation tool was extended into a modified version referred to as mSAQUET.

### Key Improvements
- Refined Handling of "More Than One Correct" Flaw: The original SAQUET approach asked GPT to determine whether more than one correct answer existed, which introduced significant false positives and reduced accuracy. Instead, mSAQUET simplifies this by having GPT solve the MCQ and return all options it considers correct—eliminating the need for secondary judgment tasks.
- Improved Matching Rates: This design change led to a drastic improvement in evaluation accuracy. The exact matching rate rose from 35% (original SAQUET) to 44%, and the "more than one correct" criterion matching rate increased from 68% to 98%.
  ![image](https://github.com/user-attachments/assets/5bbcdecd-4613-41ab-90c1-86b5eb2bb8a1)
- Cognitive Load Reduction: By focusing GPT solely on answering the MCQ, rather than also evaluating answer multiplicity, the system performs with greater precision and stability, especially under complex cognitive loads.
  ![image](https://github.com/user-attachments/assets/9f3726d4-455d-46e1-91a5-488fbacc4bf7)

These enhancements significantly strengthen SAQUET’s ability to detect item-writing flaws with higher consistency and reduced error rates, making it more suitable for automated integration in MCQ generation workflows.

## User Interface 

![form_page](https://github.com/user-attachments/assets/6d7fccfc-6f23-4700-ac37-ce2036d7d972)
![result_page](https://github.com/user-attachments/assets/4abe9a36-2942-4083-b68e-1e1de98144b2)
![solvability_checked](https://github.com/user-attachments/assets/ee30ffa9-a4b3-4715-bedc-53d3c6128a75)

## Prompt Assembly

<img width="1364" alt="prompt assembly" src="https://github.com/user-attachments/assets/2c6fdc4d-62ef-41f7-a050-6e138d6f89f7" />
