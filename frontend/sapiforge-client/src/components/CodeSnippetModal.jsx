import React, { useState } from 'react';

const CodeSnippetModal = ({ isOpen, onClose, requestData }) => {
  const [selectedLang, setSelectedLang] = useState('curl');

  if (!isOpen) return null;

  const { method, url, headers, body } = requestData;

  const generateCode = (lang) => {
    const headerLines = headers 
      ? headers.split('\n').filter(l => l.includes(':')).map(l => l.trim())
      : [];
    
    switch (lang) {
      case 'curl':
        let curl = `curl --location --request ${method} '${url}'`;
        headerLines.forEach(h => {
          curl += ` \\\n--header '${h}'`;
        });
        if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
          curl += ` \\\n--data-raw '${body.replace(/'/g, "'\\''")}'`;
        }
        return curl;

      case 'fetch':
        let fetchHeaders = {};
        headerLines.forEach(h => {
          const [key, ...val] = h.split(':');
          fetchHeaders[key.trim()] = val.join(':').trim();
        });
        const fetchCode = `fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(fetchHeaders, null, 2)},
  ${body ? `body: JSON.stringify(${body})` : ''}
})
.then(response => response.json())
.then(result => console.log(result))
.catch(error => console.log('error', error));`;
        return fetchCode;

      case 'python':
        let pyHeaders = {};
        headerLines.forEach(h => {
          const [key, ...val] = h.split(':');
          pyHeaders[key.trim()] = val.join(':').trim();
        });
        return `import requests
import json

url = "${url}"
payload = ${body ? body : 'None'}
headers = ${JSON.stringify(pyHeaders, null, 4)}

response = requests.request("${method}", url, headers=headers, json=payload)
print(response.text)`;

      case 'csharp':
        return `var client = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.${method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}, "${url}");
${headerLines.map(h => {
  const [k, v] = h.split(':');
  return `request.Headers.Add("${k.trim()}", "${v.trim()}");`;
}).join('\n')}
${body ? `request.Content = new StringContent(${JSON.stringify(body)}, null, "application/json");` : ''}
var response = await client.SendAsync(request);
response.EnsureSuccessStatusCode();
console.WriteLine(await response.Content.ReadAsStringAsync());`;

      default:
        return '';
    }
  };

  const code = generateCode(selectedLang);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert('Copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Generate Code Snippet</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-800 overflow-x-auto">
          {['curl', 'fetch', 'python', 'csharp'].map(lang => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                selectedLang === lang 
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          <div className="relative group flex-1 bg-gray-950 rounded-xl border border-gray-800 overflow-hidden">
            <pre className="p-4 text-sm font-mono text-gray-300 overflow-auto h-full whitespace-pre-wrap">
              {code}
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Copy
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetModal;
