"""
OpenFounder Agent
-----------------
Core agent loop. Manages the conversation with Claude,
handles tool calls, and drives the founder through their journey.
"""

import os
import anthropic
from .prompts import SYSTEM_PROMPT
from .tools import TOOL_SCHEMAS, dispatch_tool

MODEL = "claude-opus-4-5"
MAX_TOKENS = 4096


def run():
    """Main entry point — starts the interactive agent session."""
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    print("\n" + "═" * 60)
    print("  OPENFOUNDR — Free Business Formation for Everyone")
    print("  Open Source  |  github.com/openfoundr/openfoundr")
    print("═" * 60)
    print("\nStarting your session...\n")

    conversation = []

    # Kick off with the agent's opening message
    response = _call_claude(client, conversation, initial=True)
    conversation = response["conversation"]

    # Main conversation loop
    while True:
        try:
            user_input = input("\nYou: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\n\nTake care — good luck with your business. 🌱")
            break

        if not user_input:
            continue

        if user_input.lower() in ["quit", "exit", "bye", "q"]:
            print("\nTake care — good luck with your business. 🌱")
            break

        conversation.append({"role": "user", "content": user_input})
        response = _call_claude(client, conversation)
        conversation = response["conversation"]


def _call_claude(client, conversation: list, initial: bool = False) -> dict:
    """
    Call Claude, handle any tool use, and print the response.
    Returns the updated conversation history.
    """
    messages = conversation.copy()

    # On the very first call, nudge Claude to start the conversation
    if initial:
        messages = [{"role": "user", "content": "Hello, I want to start a business."}]

    while True:
        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=SYSTEM_PROMPT,
            tools=TOOL_SCHEMAS,
            messages=messages,
        )

        # Handle tool use
        if response.stop_reason == "tool_use":
            # Add assistant's response (with tool calls) to messages
            messages.append({"role": "assistant", "content": response.content})

            # Process each tool call
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    print(f"\n  [Looking up: {block.name}...]")
                    result = dispatch_tool(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })

            # Add tool results and continue
            messages.append({"role": "user", "content": tool_results})
            continue

        # Final text response
        full_text = ""
        for block in response.content:
            if hasattr(block, "text"):
                full_text += block.text

        if full_text:
            print(f"\nOpenFounder: {full_text}")
            messages.append({"role": "assistant", "content": full_text})

        return {"conversation": messages}
