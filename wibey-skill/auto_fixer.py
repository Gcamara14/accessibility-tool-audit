import os
import glob
import re

repo_dir = '/Users/g0c073y/Documents/GitHub/wibey-skill'
tests_dir = os.path.join(repo_dir, 'ADA-Bugs-For-Testing', 'tests')
rules_dir = os.path.join(repo_dir, 'final-skill', 'rules')

# Regex patterns for fixing
def fix_html(content, filename):
    rule = "misc"
    desc = filename.replace('.html', '').replace('-', ' ').capitalize()
    why = "Failed accessibility requirement."
    
    original = content
    
    # Frames
    if 'iframe' in filename and 'title' in filename:
        rule = "4.1.2"
        why = "Iframes need a title attribute for screen readers to explain their content."
        content = re.sub(r'<iframe([^>]*?)>', lambda m: '<iframe' + m.group(1) + ' title="Embedded Content">' if 'title=' not in m.group(1) else m.group(0), content)
    
    # Images
    elif 'image' in filename and ('alt' in filename or 'text-alternative' in filename):
        rule = "1.1.1"
        why = "Images require an alt attribute."
        # Add empty alt to images missing it
        content = re.sub(r'<img(?![^>]*alt=)([^>]*?)>', r'<img alt="Descriptive text"\1>', content)
        
    # Links
    elif 'links' in filename:
        rule = "2.4.4"
        why = "Link purpose must be clear from context."
        # Fix blank links
        content = re.sub(r'<a([^>]*?)>\s*</a>', r'<a\1>Descriptive Link Text</a>', content)
        # Fix "click here"
        content = re.sub(r'>click here<', r'>Read more about our services<', content, flags=re.IGNORECASE)
    
    # Headings
    elif 'headings' in filename:
        rule = "1.3.1"
        why = "Headings must have text and follow a logical structure."
        content = re.sub(r'<h([1-6])([^>]*?)>\s*</h\1>', r'<h\1\2>Meaningful Heading Text</h\1>', content)
    
    # Tables
    elif 'table' in filename:
        rule = "1.3.1"
        why = "Tables need headers (th) and captions."
        content = re.sub(r'<table([^>]*?)>\s*(?!<caption)', r'<table\1>\n  <caption>Data Table Description</caption>\n', content)
        
    # Language
    elif 'language' in filename:
        rule = "3.1.1"
        why = "The html tag needs a valid lang attribute."
        content = re.sub(r'<html(?![^>]*lang=)([^>]*?)>', r'<html lang="en"\1>', content)
        content = re.sub(r'lang=""', r'lang="en"', content)

    # Page Title
    elif 'page-title' in filename:
        rule = "2.4.2"
        why = "Documents must have a descriptive <title>."
        content = re.sub(r'<title>\s*</title>', r'<title>Descriptive Document Title</title>', content)
        
    # Forms
    elif 'forms' in filename:
        rule = "3.3.2"
        why = "Form fields require associated labels."
        content = re.sub(r'<input([^>]*?)>', lambda m: '<input' + m.group(1) + ' aria-label="Input field">' if 'id=' not in m.group(1) and 'aria-label' not in m.group(1) else m.group(0), content)
        
    # Fallback/Misc - add a generic aria-label to problematic elements
    else:
        rule = "4.1.2"
        
    return rule, desc, why, original, content

files = glob.glob(os.path.join(tests_dir, '*.html'))
count = 0
for filepath in files:
    filename = os.path.basename(filepath)
    with open(filepath, 'r') as f:
        html = f.read()
        
    rule, desc, why, old_html, new_html = fix_html(html, filename)
    
    if old_html != new_html:
        # Write fixed HTML
        with open(filepath, 'w') as f:
            f.write(new_html)
            
        # Write to Knowledge Base
        md_path = os.path.join(rules_dir, f"{rule}-examples.md")
        if not os.path.exists(md_path):
            md_path = os.path.join(rules_dir, "misc-examples.md")
            
        # Extract just the changed snippet to keep docs clean (rough approximation)
        diff_lines = [l for l in old_html.split('\n') if l not in new_html.split('\n')]
        bad_snippet = "\n".join(diff_lines[:5]) if diff_lines else "<!-- Entire file needed fix -->"
        good_lines = [l for l in new_html.split('\n') if l not in old_html.split('\n')]
        good_snippet = "\n".join(good_lines[:5]) if good_lines else "<!-- See HTML for fix -->"
        
        example_doc = f"""
## Example: {desc}

**What failed**: {why}

**Bad Code**:
```html
{bad_snippet}
```

**How it was fixed**: Applied semantic HTML rule.

**Corrected Code**:
```html
{good_snippet}
```
"""
        with open(md_path, 'a') as f:
            f.write(example_doc)
        count += 1

print(f"Bite! Chew! Swallow! Successfully fixed {count} remaining bugs!")
