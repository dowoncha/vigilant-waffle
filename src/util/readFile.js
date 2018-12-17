const readFile = async(file) => {  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const text = reader.result;

      resolve(text);
    }

    reader.onerror = function(e) {
      reject(e);
      reader.abort();
    }

    reader.readAsText(file);
  })
};

export default readFile