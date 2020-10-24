import React, {useState} from 'react';
import { Container, Tab, Row, Col, Nav, Form, Button } from 'react-bootstrap';
import { Stage, Layer, Image , Text, Transformer, Group } from 'react-konva';
import useImage from 'use-image';
import ImageUploader from 'react-images-upload';
import FontPicker from "font-picker-react";
import m_texture from "./../m_texture.png";
import "./mobile.css";



const TextRect = ({text,font,color,fontFamily,shadowColor,shadowEnable,rotation,shapeProps,isSelected, onSelect, onChange,onDragEndM,onDragStartM}) => {  
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
					fontFamily={fontFamily}
					shadowColor={shadowColor}
					shadowEnabled={shadowEnable}
					shadowOffset={{x:1,y:1}}
					rotation={rotation}
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

const ColoredRect = ({selectedImg,shapeProps,isSelected, onSelect, onChange,onDragEndM,onDragStartM }) => {  
const [image] = useImage(selectedImg);
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
  const [image] = useImage(m_texture);
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
	const [selectedImg, setSelectedImg] = React.useState('');
  const [selectedId, selectShape] = React.useState('img');  
  const [selectedTextId, selectText] = React.useState('txt');
  const [isDragging, setDragging] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(14);
  const [fontFamily, setFontFamily] = React.useState("Open Sans");
	const [color, setColor] = React.useState('#000000');
	const [shadowColor, setShadowColor] = React.useState('');
	const [shadowEnable, setShadowEnable] = React.useState(false);
	const [rotation, setRotation] = React.useState(0);	
  const [textData, setTextData] = React.useState('')


  const checkDeselect = (e) => {            
        setDragging(true)
  };
  return (
      <Container fluid>
        <Row>
          <Col sm={6}>
            <Tab.Container id="left-tabs-example" defaultActiveKey="second">
            <Row>
              <Col sm={3} className="pills-box">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="second">Text</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="third">Image</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="second">
                    <h4 className="widget-title">
                      Add New Text
                    </h4>
                    <Form.Group>
                      <Form.Label>Type here</Form.Label>
                       <Form.Control type="text" onChange={(e) => setTextData(e.target.value)} value={textData} placeholder="Type something here" />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Font Size</Form.Label>
                       <Form.Control type="range" onChange={(e) => setFontSize(e.target.value)} value={fontSize} placeholder="" />
                    </Form.Group>									
                    <Form.Group>
                      <Form.Label>Font Color</Form.Label>
                       <Form.Control type="color" onChange={(e) => setColor(e.target.value)} value={color} placeholder="" />
                    </Form.Group>	
                    <Form.Group>
                      <Form.Label>Font Family</Form.Label>
                      <FontPicker
                        apiKey="AIzaSyA94amz2aeB9v66mvhYBEPVubflbyN6z-k"
                        className="form-control"
                        activeFontFamily={fontFamily}
                        onChange={(nextFont) =>
                            setFontFamily(nextFont.family)
                        }
                    />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Outlie</Form.Label>
                       <Form.Control type="checkbox" onChange={(e) => setShadowEnable(!shadowEnable)} value={shadowEnable} placeholder="" />
                    </Form.Group>																	
                    <Form.Group>
                      <Form.Label>Outline Color</Form.Label>
                       <Form.Control type="color" disabled={!shadowEnable} onChange={(e) => setShadowColor(e.target.value)} value={shadowColor} placeholder="" />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Arc</Form.Label>
                       <Form.Control type="range" min="0" max="360" onChange={(e) => setRotation(e.target.value)} value={rotation} placeholder="" />
                    </Form.Group>
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <Col>
                      <h4 className="widget-title">
                        UPLOAD ART
                      </h4>
                      <ImageUploader
                          withIcon={true}
                          buttonText='Choose images'
                          onChange={(e) => setSelectedImg(URL.createObjectURL(e[0]))}
                          imgExtension={['.jpg', '.gif', '.png', '.gif']}
                          maxFileSize={5242880}
                          singleImage={true}
                      />
                    </Col>
                  </Tab.Pane>
                  </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
          </Col>
          <Col sm={6} className="canvasContainer"> 
      <Stage
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
      width={window.innerWidth} height={window.innerHeight} >
        <Layer>
          
          <Portal selector=".top-layer" enabled={isDragging}>
          {selectedImg !== '' && 
            <ColoredRect
              selectedImg={selectedImg}
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
            }
            {textData !== '' &&  
              <TextRect 
                text={textData}
                font={fontSize}
                color={color}
                fontFamily={fontFamily}
                shadowColor={shadowColor}
                shadowEnable={shadowEnable}
                rotation={rotation}
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
              }
            </Portal>            
            <FixShape />
        </Layer>
        <Layer name="top-layer" />
      </Stage>
      </Col>
			</Row>
		</Container>
  )
}

export default Mobile;
