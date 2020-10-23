import React, {useState} from 'react';
import { Stage, Layer, Image , Text, Transformer, Group } from 'react-konva';
import useImage from 'use-image';
import "./mobile.css";



const TextRect = ({text,font,color,shapeProps,isSelected, onSelect, onChange,onDragEndM,onDragStartM }) => {  
  const shapeRef = React.useRef();
  const trRef = React.useRef();
  React.useEffect(() => {
    console.log(shapeRef)
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
      return (
        <React.Fragment>
        <Text
          text={text}
          fill={color}
          onDragStart={(e) => {
            onDragStartM(true)
          }}
          fontSize={font}
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          {...shapeProps}
          draggable
          onDragEnd={(e) => {
            onDragEndM(false)
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            // transformer is changing scale of the node
            // and NOT its width or height
            // but in the store we have only width and height
            // to match the data better we will reset scale on transform end
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
  
            // we will reset it back
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              x: node.x(),
              y: node.y(),
              // set minimal value
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
            });
            onDragEndM(false)
          }}
        />
        <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
          </React.Fragment>
      );
  }

const ColoredRect = ({shapeProps,isSelected, onSelect, onChange,onDragEndM,onDragStartM }) => {  
const [image] = useImage('https://konvajs.org/assets/lion.png');
const [isDragging,setIsDragging] = useState(false);
const shapeRef = React.useRef();
const trRef = React.useRef();
React.useEffect(() => {
  console.log(shapeRef)
  if (isSelected) {
    // we need to attach transformer manually
    trRef.current.nodes([shapeRef.current]);
    trRef.current.getLayer().batchDraw();
  }
}, [isSelected]);
    return (
      <React.Fragment>
      <Image
        image={image}
        fill={isDragging ? 'green' : 'black'}
        onDragStart={(e) => {
          setIsDragging(true)
          onDragStartM(true)
        }}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onDragEndM(false)
          setIsDragging(false)
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
          onDragEndM(false)
        }}
      />
      <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
        </React.Fragment>
    );
}

const FixShape = () => {
  const [image] = useImage('https://www.yourprint.in/wp-content/uploads/2019/03/Xiaomi-Redmi-Note-7.png');
      return (
        <Image
          image={image}         
        />
      );
  }

// make a portal implementation
const Portal = ({ selector, enabled, children }) => {
  // "selector" is a string to find another container to insert all internals
  // if can be like ".top-layer" or "#overlay-group"
  const outer = React.useRef(null);
  const inner = React.useRef(null);

  React.useEffect(() => {
    const stage = outer.current.getStage();
    const newContainer = stage.findOne(selector);
    if (enabled && newContainer) {
      inner.current.moveTo(newContainer);
    } else {
      inner.current.moveTo(outer.current);
    }
    // manually redraw layers
    outer.current.getLayer().batchDraw();
    if (newContainer) {
      newContainer.getLayer().batchDraw();
    }
  }, [selector, enabled]);

  // for smooth movement we will have to use two group
  // outer - is main container
  // inner - that we will move into another container
  return (
    <Group name="_outer_portal" ref={outer}>
      <Group name="_inner_portal" ref={inner}>
        {children}
      </Group>
    </Group>
  );
};


const initialImage = 
  {
    x: 200,
    y: 150,
    id: 'img',
  };
const initialText = 
  {
    x: 200,
    y: 450,
    id: 'txt',
  };


const Mobile = () => {
  const [images, setImages] = React.useState(initialImage);
  const [texts, setTexts] = React.useState(initialText);
  const [selectedId, selectShape] = React.useState(null);  
  const [selectedTextId, selectText] = React.useState(null);
  const [isDragging, setDragging] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(14);
  const [color, setColor] = React.useState('#000');
  const [textData, setTextData] = React.useState('Write something')


  const checkDeselect = (e) => {            
        setDragging(true)
  };
  return (
    <>
    <div style={{width:'200px', height:'300px',float:'left'}}>
      <input type="text" value={textData} onChange={(e) => setTextData(e.target.value)} />
      <input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} />
      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
    </div>
    <div className="canvasContainer">    
      <Stage
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
      width={window.innerWidth} height={window.innerHeight} >
        <Layer>
          
          <Portal selector=".top-layer" enabled={isDragging}>
            <ColoredRect
              shapeProps={images}
              isSelected={selectedId}
              onSelect={() => {
                selectShape(images.id);
              }}
              onChange={(newAttrs) => {
                const rects = newAttrs;
                setImages(rects);
              }}
              onDragStartM={(e)=>{
                  setDragging(e)
                }
              }
              onDragEndM={(e)=>{
                  setDragging(e)
                }
              } 
              />              
              <TextRect 
                text={textData}
                font={fontSize}
                color={color}
                shapeProps={texts}
                isSelected={selectedTextId}
                onSelect={() => {
                  selectText(texts.id);
                }}
                onChange={(newAttrs) => {
                  const rects = newAttrs;
                  setTexts(rects);
                }}
                onDragStartM={(e)=>{
                    setDragging(e)
                  }
                }
                onDragEndM={(e)=>{
                    setDragging(e)
                  }
                }  />
            </Portal>            
            <FixShape />
        </Layer>
        <Layer name="top-layer" />
      </Stage>
    </div>
    </>
  );
}

export default Mobile;
