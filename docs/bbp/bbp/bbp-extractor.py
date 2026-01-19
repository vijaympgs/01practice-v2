#!/usr/bin/env python3
"""
BBP Section Extractor - Simple Version
Extracts specific sections from a large BBP markdown file
Usage: python bbp_extractor.py 2.1
"""

import sys

def extract_section(file_path, section_number):
    """Extract a specific section from BBP markdown file"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    section_lines = []
    capturing = False
    section_level = 0
    
    for i, line in enumerate(lines):
        # Check if this is a section header
        if line.startswith('#'):
            # Count the # symbols
            level = len(line) - len(line.lstrip('#'))
            
            # Extract section number from header
            # Matches patterns like "## 2.1 Attributes"
            parts = line.lstrip('#').strip().split(maxsplit=1)
            if parts:
                line_section = parts[0]
                
                # Check if this is our target section
                if line_section == section_number:
                    capturing = True
                    section_level = level
                    section_lines.append(line)
                    continue
                
                # If we're capturing and hit a section at same/higher level, stop
                elif capturing and level <= section_level:
                    break
        
        # Capture lines if we're in the target section
        if capturing:
            section_lines.append(line)
    
    return ''.join(section_lines).strip() if section_lines else None


def count_tokens_estimate(text):
    """Rough estimate of tokens (1 token ≈ 4 characters)"""
    return len(text) // 4


def main():
    if len(sys.argv) < 2:
        print("Usage: python bbp_extractor.py <section_number> [bbp_file]")
        print("Example: python bbp_extractor.py 2.1")
        sys.exit(1)
    
    section_number = sys.argv[1]
    bbp_file = sys.argv[2] if len(sys.argv) > 2 else '01retail_bbp_v_0_3_till_3.md'
    
    print(f"📄 Reading BBP file: {bbp_file}")
    print(f"🔍 Extracting section: {section_number}")
    
    try:
        section_content = extract_section(bbp_file, section_number)
        
        if not section_content:
            print(f"❌ Section {section_number} not found!")
            sys.exit(1)
        
        # Calculate stats
        token_count = count_tokens_estimate(section_content)
        lines_count = len(section_content.split('\n'))
        
        print(f"\n📊 Section Stats:")
        print(f"   Lines: {lines_count}")
        print(f"   Characters: {len(section_content):,}")
        print(f"   Estimated tokens: ~{token_count:,}")
        print(f"   Cost estimate: ~${(token_count * 3 / 1_000_000):.4f} (input)")
        
        print("\n" + "="*70)
        print(section_content)
        print("="*70)
        
        # Ask if user wants to save
        save = input("\n💾 Save to file? (y/n): ").strip().lower()
        if save == 'y':
            output = f"section_{section_number.replace('.', '_')}.md"
            filename = input(f"Filename [{output}]: ").strip() or output
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(section_content)
            print(f"✅ Saved to: {filename}")
    
    except FileNotFoundError:
        print(f"❌ File not found: {bbp_file}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()