import React, { useContext } from "react";

import "./app.css";
import { Code } from "./Code";
import { examples } from "./examples";
import { slugify } from "./utils";

interface ContainerContextValues {
  registerNode: (element: any, any?) => void;
}

const ContainerContext = React.createContext<ContainerContextValues>({registerNode: () => {return}});
const Container = ({children}: {children: React.ReactNode}) => {
  const refs = React.useRef([])
  const registerNode = (element, args) => {
    refs.current.push({element, ...args})
    console.log('elements', refs.current)
  }
  return (
    <ContainerContext.Provider value={{registerNode}}>
      {children}
    </ContainerContext.Provider>
  )
}

const Child = ({id}: {id: number}) => {
  const ref = React.useRef<HTMLDivElement>();
  const {registerNode} = useContext(ContainerContext);
  React.useEffect(() => {
    registerNode(ref.current, {id})
  }, [])
  return (
    <div ref={ref}>
      Child
    </div>
  )
}

export const App = () => {
  const [count, setCount] = React.useState(0);
  console.log("debug", examples);

  return (
    <div className="app-container">
      <h1>React to PDF - Examples</h1>
      <Container>
        <Child id={1}/>
        <Child id={2}/>
      </Container>
      <button onClick={()=> setCount(count + 1)}>increase</button>
      {(examples || []).slice(0, 3).map((example) => (
        <a id={`example-${slugify(example.title)}`} key={example.title}>
          <h3>{example.title}</h3>
          {example.content && <Code>{example.content}</Code>}
          <example.component />
        </a>
      ))}
    </div>
  );
};
