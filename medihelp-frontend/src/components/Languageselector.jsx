import React from 'react';

const LanguageSelector = () => {
  const languages = ['English', 'Spanish', 'French', 'Amharic'];
  const [selectedLanguage, setSelectedLanguage] = React.useState(languages[0]);

  const handleChange = (event) => {
    setSelectedLanguage(event.target.value);
    // Add logic to change the application's language here
  };

  return (
    <div className="language-selector">
      <label htmlFor="language" className="mr-2">Select Language:</label>
      <select id="language" value={selectedLanguage} onChange={handleChange} className="border rounded p-1">
        {languages.map((language) => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;