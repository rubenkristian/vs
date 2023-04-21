import './App.css';
import { VirtueScroll } from './components/VirtueScroll';

interface People {
  image: string;
  name: string;
}

function App() {
  const datas: People[] = Array<People>(100000).fill({name: "Name", image: "image"});
  return (
    <div className="App">
      <div style={{height: 150, backgroundColor: 'blue'}}></div>
      <div style={{height: 150, backgroundColor: 'blue'}}></div>
      <VirtueScroll 
        items={datas} 
        itemsCount={datas.length}
        itemHeight={70}
        buffer={2}
        renderItem={function (data: People, index: number) {
          return (
            <>
              <div>
                <span>{data.image}</span>
                <span>{data.name}</span>
                <span>{index}</span>
              </div>
            </>
          );
        }}        
      />
      <div style={{height: 150, backgroundColor: 'blue'}}></div>
      <div style={{height: 150, backgroundColor: 'blue'}}></div>
    </div>
  );
}

export default App;
