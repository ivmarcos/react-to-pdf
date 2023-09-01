const path = require('path');
const fs = require('fs');

const DOC_FILE = 'Introduction.mdx'

const readFile = (filePath) => fs.readFileSync(path.join(process.cwd(), 'src', 'stories', filePath))
const getDocPath = () => path.join(process.cwd(), 'src', 'stories', DOC_FILE);

const prepend = (filePath, content) => {
    const previousContent = fs.readFileSync(filePath);
    fs.writeFileSync(filePath, content);
    fs.appendFileSync(filePath, previousContent);
}

const docsSequence = [
    {
        section: 'Using `usePDF` hook',
        component: 'ExampleUsePDF'
    },
    {
        section: 'Using default function',
        component: 'ExampleFunction'
    },
    {
        section: 'Multipage support',
        component: 'ExampleMultipage'
    },
    {
        section: 'Advanced Options',
        component: 'ExampleAdvanced'
    },
]

const appendContent = (content) => {
    fs.appendFileSync(getDocPath(), content);
}

function run() {
    const introContent = readFile('preintro.md')
    fs.writeFileSync(getDocPath(), introContent);
    docsSequence.forEach(docSequence => {
        const exampleContent = readFile(`${docSequence.component}.tsx`);
        appendContent('\n')
        appendContent(`### ${docSequence.section}\n`);
        appendContent('\n')
        appendContent(`\`\`\`tsx\n${exampleContent}\`\`\`\n`)
        appendContent('\n')
        appendContent(`<${docSequence.component}/>\n`)
        prepend(getDocPath(), `import { ${docSequence.component} } from './${docSequence.component}';\n`)
    })
}

run();



