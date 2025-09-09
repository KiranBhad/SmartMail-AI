console.log("SmartMail AI Extension");
function getEmailContent(){
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];

    for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) return content.innerText.trim();
    return '';
  }
}
function findComposeToolbar() {
  const selectors = [
    '.btC',
    '.aDh',                 // compose footer actions                 // compose controls container
'[role="toolbar"]', // compose dialog controls
    '.gU.Up'                // message action bar
  ];

  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) return toolbar;
  }
  return null; // <-- return null AFTER checking all selectors
}

function createAIButton() {
  const button = document.createElement('div');
  // Reuse Gmail styles + our own class for easy targeting
  button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button';
  button.style.marginRight = '8px';
  button.textContent = 'AI Reply';
  button.setAttribute('role', 'button');
  button.setAttribute('data-tooltip', 'Generate AI Reply');

  return button;
}

function injectButton() {
  // Avoid duplicates
  if (document.querySelector('.ai-reply-button')) return;

  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.log("[SmartMail] Toolbar not found yet");
    return;
  }

  console.log("");
  const button = createAIButton();
  button.classList.add('ai-reply-button');

  toolbar.insertBefore(button, toolbar.firstChild);
  
  button.addEventListener('click', async () =>{
    try{
        button.innerHTML = "Generating...";
        button.disabled = true;
        const emailContent = getEmailContent();

        const response = await fetch('http://localhost:8080/api/email/generate',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailContent: emailContent,
                tone: "Professional"
            })
        });

        if(!response.ok){
            throw new Error("API Request Failed");
        }

        const generatedReply = await response.text();

        const composeBox = document.querySelector(
            '[role="textbox"][g_editable="true"]'
        );

        if(composeBox){
            composeBox.focus();
            document.execCommand('insertText',false,generatedReply);
        }
    } catch(error){

    } 
    finally{
        button.innerHTML='AI Reply';
    }
  })

  // Try to insert right after the Send button, else append to toolbar
  const sendButton =
    toolbar.querySelector('.T-I.J-J5-Ji.aoO') ||
    toolbar.querySelector('div[role="button"][data-tooltip*="Send"]');

  if (sendButton && sendButton.parentElement) {
    sendButton.parentElement.insertBefore(button, sendButton.nextSibling);
  } else {
    toolbar.appendChild(button);
  }

  console.log("[SmartMail] AI button injected");
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);
    const hasComposeElements = addedNodes.some((node) =>
      node.nodeType === Node.ELEMENT_NODE &&
      (
        node.matches?.('.btC, .aDh, [role="dialog"], .gU.Up') ||
        node.querySelector?.('.btC','.aDh','[role="dialog"]', '.gU.Up')
      )
    );

    if (hasComposeElements) {
      console.log("Compose Window Detected.");
      setTimeout(injectButton, 500); // <-- fixed function name
      break;
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Also try once on load (useful when Gmail is already open)
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(injectButton, 1000);
});
