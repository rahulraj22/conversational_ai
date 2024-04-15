# api key : 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
from openai import OpenAI
client = OpenAI(
    api_key='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',
)

completion = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair."},
    {"role": "user", "content": "Compose a poem that explains the concept of recursion in programming."}
  ]
)

print(completion.choices[0].message)