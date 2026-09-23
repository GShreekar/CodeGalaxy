import { PrismLight } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import dart from 'react-syntax-highlighter/dist/esm/languages/prism/dart';
import elixir from 'react-syntax-highlighter/dist/esm/languages/prism/elixir';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import haskell from 'react-syntax-highlighter/dist/esm/languages/prism/haskell';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import kotlin from 'react-syntax-highlighter/dist/esm/languages/prism/kotlin';
import lua from 'react-syntax-highlighter/dist/esm/languages/prism/lua';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import objectivec from 'react-syntax-highlighter/dist/esm/languages/prism/objectivec';
import perl from 'react-syntax-highlighter/dist/esm/languages/prism/perl';
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php';
import powershell from 'react-syntax-highlighter/dist/esm/languages/prism/powershell';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import r from 'react-syntax-highlighter/dist/esm/languages/prism/r';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import scala from 'react-syntax-highlighter/dist/esm/languages/prism/scala';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import swift from 'react-syntax-highlighter/dist/esm/languages/prism/swift';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';

// only the languages CodeGalaxy actually supports (see utils/languages.js),
// instead of Prism's full ~280-language bundle. "Text" is deliberately not
// registered — an unregistered language name renders as plain unhighlighted
// text rather than throwing, which is exactly what "Text" should do.
PrismLight.registerLanguage('bash', bash);
PrismLight.registerLanguage('c', c);
PrismLight.registerLanguage('csharp', csharp);
PrismLight.registerLanguage('cpp', cpp);
PrismLight.registerLanguage('css', css);
PrismLight.registerLanguage('dart', dart);
PrismLight.registerLanguage('elixir', elixir);
PrismLight.registerLanguage('go', go);
PrismLight.registerLanguage('haskell', haskell);
PrismLight.registerLanguage('markup', markup);
PrismLight.registerLanguage('java', java);
PrismLight.registerLanguage('javascript', javascript);
PrismLight.registerLanguage('json', json);
PrismLight.registerLanguage('kotlin', kotlin);
PrismLight.registerLanguage('lua', lua);
PrismLight.registerLanguage('markdown', markdown);
PrismLight.registerLanguage('objectivec', objectivec);
PrismLight.registerLanguage('perl', perl);
PrismLight.registerLanguage('php', php);
PrismLight.registerLanguage('powershell', powershell);
PrismLight.registerLanguage('python', python);
PrismLight.registerLanguage('r', r);
PrismLight.registerLanguage('ruby', ruby);
PrismLight.registerLanguage('rust', rust);
PrismLight.registerLanguage('scala', scala);
PrismLight.registerLanguage('sql', sql);
PrismLight.registerLanguage('swift', swift);
PrismLight.registerLanguage('typescript', typescript);
PrismLight.registerLanguage('yaml', yaml);

export default PrismLight;
