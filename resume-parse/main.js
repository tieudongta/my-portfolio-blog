const dataRegex = {
    name: /\b[A-Z][a-z]+(?:\s[A-Z][a-z]+){1,2}\b/gm,
    DOB: /\b(?:\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})\b/,
    Skills: /Skills:\s*(.+)/i,
    email:/\b[\w\.]+@\w+.\w{2,3}\b/,
    phone:/\b\d{3}[-.]?\d{3,4}[-.]?\d{4}?\b/,
    github: /https?:\/\/(www\.)?github\.com\/[\w-]+/i,
    linkedin: /https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+/i
};
function parseResume(){
    let text = document.getElementById('resume-input').value;
    const output = {};
    if(!text) text = textData;
    for(const key in dataRegex){
        const match = text.match(dataRegex[key]);
        output[key] = match ? match[0]:null;
    }
    document.getElementById('output').textContent = JSON.stringify(output, null, 2);
}
function parser(){
    dataRegex
}
const textData = `
Name: Jane Doe
Email: jane.doe1990@gmail.com
Phone: 123-4567
Website: https://janedoe.dev
LinkedIn: https://linkedin.com/in/janedoe
GitHub: https://github.com/janedoe
DOB: 1990-08-15
Skills: JavaScript, Python, HTML/CSS, React, Node.js
Experience:
- Frontend Developer at Webify (2019–2022)
- Intern at CodeBase (2018)

Education:
B.Sc. Computer Science, University of Example (2014–2018)

Other Candidates:
Name: Bob Smith
Email: bob@domain
Phone: 0000-000
DOB: 1991-15-40
Skills: Java, Spring, ?
`;