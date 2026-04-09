// ── Script Service ──────────────────────────────────────────────
// Scripts are executed using a Restricted Function sandbox.

export const executeScript = (script, context) => {
  if (!script) return context.environment;

  const env = { ...context.environment };
  
  // Custom Postman-like 'pm' object
  const pm = {
    environment: {
      set: (key, value) => {
        env[key] = value;
      },
      get: (key) => {
        return env[key];
      }
    },
    log: (msg) => console.log('[Script Log]:', msg),
    response: context.response ? {
        json: () => {
            try { return JSON.parse(context.response.body); } 
            catch { return null; }
        },
        code: context.response.statusCode
    } : null
  };

  try {
    // We pass pm as an argument to the function
    const fn = new Function('pm', script);
    fn(pm);
  } catch (err) {
    console.error('Script Error:', err);
  }

  return env;
};
