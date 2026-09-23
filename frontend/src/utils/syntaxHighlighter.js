import { PrismLight } from 'react-syntax-highlighter';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import swift from 'react-syntax-highlighter/dist/esm/languages/prism/swift';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import kotlin from 'react-syntax-highlighter/dist/esm/languages/prism/kotlin';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';

// only the languages CodeGalaxy actually supports (see utils/languages.js),
// instead of Prism's full ~280-language bundle
PrismLight.registerLanguage('javascript', javascript);
PrismLight.registerLanguage('typescript', typescript);
PrismLight.registerLanguage('python', python);
PrismLight.registerLanguage('java', java);
PrismLight.registerLanguage('cpp', cpp);
PrismLight.registerLanguage('ruby', ruby);
PrismLight.registerLanguage('php', php);
PrismLight.registerLanguage('go', go);
PrismLight.registerLanguage('swift', swift);
PrismLight.registerLanguage('rust', rust);
PrismLight.registerLanguage('kotlin', kotlin);
PrismLight.registerLanguage('sql', sql);

export default PrismLight;
