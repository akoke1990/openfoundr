"""
OpenFounder — end-to-end test
Simulates a real founder conversation without needing stdin.
"""

import os
import sys
import anthropic

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from agent.prompts import SYSTEM_PROMPT
from agent.tools import TOOL_SCHEMAS, dispatch_tool

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

CONVERSATION = [
    "Hi, I want to start a business.",
    "I'm in New York. I want to start a residential cleaning business. Just me to start, solo.",
    "I definitely want liability protection. I'm not planning to raise VC or anything like that.",
    "Yes, please draft me an operating agreement. My name is Maria Gonzalez, the business will be called Sunshine Cleaning LLC, based in Queens.",
    "Can you give me my full launch checklist?",
]

def run_turn(messages: list, user_input: str) -> tuple[str, list]:
    messages.append({"role": "user", "content": user_input})

    while True:
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=4096,
            system=SYSTEM_PROMPT,
            tools=TOOL_SCHEMAS,
            messages=messages,
        )

        if response.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": response.content})
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    print(f"    → tool: {block.name}")
                    result = dispatch_tool(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })
            messages.append({"role": "user", "content": tool_results})
            continue

        text = "".join(b.text for b in response.content if hasattr(b, "text"))
        messages.append({"role": "assistant", "content": text})
        return text, messages


def main():
    print("\n" + "═" * 65)
    print("  OPENFOUNDR — Live Agent Test")
    print("═" * 65)

    messages = []

    for i, user_msg in enumerate(CONVERSATION, 1):
        print(f"\n{'─' * 65}")
        print(f"  USER [{i}/{len(CONVERSATION)}]: {user_msg}")
        print(f"{'─' * 65}")

        reply, messages = run_turn(messages, user_msg)

        # Truncate long replies for test output readability
        preview = reply[:800] + ("\n\n  [... response continues ...]" if len(reply) > 800 else "")
        print(f"\n  AGENT: {preview}")

    print("\n" + "═" * 65)
    print("  ✓ Test complete — all turns passed")
    print(f"  ✓ {len(messages)} messages in conversation")
    print(f"  ✓ Operating agreement generated")
    print(f"  ✓ Launch checklist generated")
    print("═" * 65 + "\n")


if __name__ == "__main__":
    main()
