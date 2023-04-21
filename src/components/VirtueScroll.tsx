import { useEffect, useRef, useState } from "react";
import { VirtueScrollProps, IndexVisible } from "../types";

const MAX_HEIGHT_SCROLL = 1500000;

export function VirtueScroll<T>(props: VirtueScrollProps<T>) {
  const {
    items,
    itemsCount,
    itemHeight,
    buffer,
    renderItem,
  } = props;

  const containerElem = useRef<HTMLDivElement>(null);
  const [ scrollPosition, setScrollPosition ] = useState<number>(0);
  const [ containerYPos, setContainerYPos ] = useState<number>(0);
  const [ currWindowHeight, setCurrWindowHeight ] = useState<number>(0);
  const [ indexVisible, setIndexVisible ] = useState<IndexVisible>({
    start: 0,
    end: 0,
  });
  const [ visibleItem, setVisibleItem ] = useState<T[]>([]);
  const [paddingTop, setPaddingTop] = useState<number>(0);
  const [paddingBottom, setPaddingBottom] = useState<number>(0);

  useEffect(() => {
    let startIndex = 0;
    let endIndex = 0;
    if (scrollPosition > containerYPos) {
      startIndex = Math.floor((scrollPosition - containerYPos) / itemHeight);
      endIndex = Math.ceil(((scrollPosition - containerYPos) + currWindowHeight) / itemHeight);
    } else {
      startIndex = 0;
      endIndex = Math.ceil((currWindowHeight + (containerYPos)) / itemHeight);
    }

    setIndexVisible({
      start: (startIndex - (buffer ?? 0) > 0) ? (startIndex - (buffer ?? 0)) : 0 , 
      end: ((endIndex + (buffer ?? 0)) < itemsCount) ? (endIndex + (buffer ?? 0)) : endIndex
    });
  }, [currWindowHeight, scrollPosition, containerYPos]);

  useEffect(() => {
    setVisibleItem(items.slice(indexVisible.start, indexVisible.end));
    setPaddingTop(indexVisible.start <= 0 ? 0 : (indexVisible.start - 1) * itemHeight);
    setPaddingBottom(indexVisible.end >= itemsCount ? 0 : (itemsCount - indexVisible.end - 1) * itemHeight);
  }, [indexVisible]);
  
  useEffect(() => {
    console.log(visibleItem);
  }, [visibleItem]);

  useEffect(() => {
    if (containerElem) {
      setContainerYPos(containerElem.current?.offsetTop ?? 0);
    }
  }, [containerElem]);

  useEffect(() => {
    const handleWindowResize = () => {
      setCurrWindowHeight(window.innerHeight);
    }

    const handleWindowScroll = () => {
      setScrollPosition(window.scrollY);
    }

    setScrollPosition(window.scrollY);
    setCurrWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('scroll', handleWindowScroll);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, []);

  return (
    <>
      <div
        ref={containerElem}
        style={{overflowY: 'hidden'}}
      >
        <div style={{paddingTop: paddingTop, paddingBottom: paddingBottom, display: 'flex', flexDirection: 'column'}}>
          {
            visibleItem.map((data, index) => {
              const currRealIndex = indexVisible.start + index;
              return (
                <div key={currRealIndex} style={{height: itemHeight, width: '100%'}}>
                  {
                    renderItem(data, currRealIndex)
                  }
                </div>
              );
            })
          }
        </div>
      </div>
    </>
  );
}