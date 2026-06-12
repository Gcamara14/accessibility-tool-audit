import os
import glob
import asyncio
from pydantic import BaseModel, Field
from pydantic_ai import Agent

# Define the precise structure we want the AI to return for every single bug
class AccessibilityFix(BaseModel):
    rule: str = Field(description="The exact WCAG rule number, e.g., '1.1.1' or '2.4.3'")
    description: str = Field(description="A short, clear description of the specific bug")
    why_it_failed: str = Field(description="A 1-2 sentence explanation of why this fails WCAG guidelines")
    bad_code_snippet: str = Field(description="The exact snippet of HTML that is failing")
    good_code_snippet: str = Field(description="The exact snippet of HTML after you fixed it")
    full_fixed_html: str = Field(description="The COMPLETE, full HTML file content with your fix applied. Do not truncate!")

# Initialize the Pydantic AI Agent to use the Element LLM Gateway!
# Because the Gateway uses the OpenAI specification, we MUST prefix the model with 'openai:'
# This forces Pydantic AI to use the OpenAI client, which will automatically read your 
# OPENAI_BASE_URL and OPENAI_API_KEY environment variables!
agent = Agent(
    'openai:gemini-2.5-flash',
    output_type=AccessibilityFix,
    system_prompt="""You are an expert Walmart Accessibility AI Agent. 
You will be given the full HTML of a page containing an accessibility bug.
Your job is to:
1. Identify the primary WCAG AA/AAA violation.
2. Map it to the exact rule number (e.g., '1.1.1', '1.3.1').
3. Explain why it fails and provide the bad/good snippets.
4. Return the ENTIRE updated HTML string in `full_fixed_html` with your fix applied. Ensure the fix is targeted and correct."""
)

async def process_file(filepath: str):
    print(f"🐶 Sniffing file: {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    try:
        # Run the agent!
        result = await agent.run(f"Please fix the accessibility bug in this HTML:\n\n{html}")
        fix = result.data
        
        # 1. Overwrite the HTML with the fixed version
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fix.full_fixed_html)
            
        # 2. Document the fix in our knowledge base
        repo_dir = os.path.dirname(os.path.abspath(__file__))
        rule_file = os.path.join(repo_dir, 'final-skill', 'rules', f'{fix.rule}-examples.md')
        
        # If the file doesn't exist (e.g., it's a AAA rule we didn't scaffold), fallback to a general bucket
        if not os.path.exists(rule_file):
            rule_file = os.path.join(repo_dir, 'final-skill', 'rules', 'misc-examples.md')
            
        example_entry = f"""
## Example: {fix.description} (File: {os.path.basename(filepath)})

**What failed**: {fix.why_it_failed}

**Bad Code**:
```html
{fix.bad_code_snippet}
```

**How it was fixed**: Applied the correct fix based on the component type.

**Corrected Code**:
```html
{fix.good_code_snippet}
```
"""
        with open(rule_file, 'a', encoding='utf-8') as f:
            f.write(example_entry)
            
        print(f"✅ Fixed! Mapped to Rule {fix.rule} and documented in {os.path.basename(rule_file)}.")
        
    except Exception as e:
        print(f"❌ Failed to process {filepath}: {str(e)}")

async def main():
    repo_dir = os.path.dirname(os.path.abspath(__file__))
    tests_dir = os.path.join(repo_dir, 'ADA-Bugs-For-Testing', 'tests')
    
    # Grab all remaining HTML files
    files = glob.glob(os.path.join(tests_dir, '*.html'))
    
    # We will slice the first 10 for a test run so it doesn't take 20 minutes!
    # Change files[:10] to just `files` when you want to run the whole batch.
    test_batch = files[:10]
    
    print(f"🚀 Starting Pydantic AI Batch Ingestion on {len(test_batch)} files...")
    
    for f in test_batch:
        await process_file(f)
        
    print("\n🎉 Batch Complete! Check your ADA-Bugs-For-Testing folder and final-skill/rules/ directory!")

if __name__ == "__main__":
    asyncio.run(main())
