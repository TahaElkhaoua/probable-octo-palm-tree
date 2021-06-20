import React, { useState, useEffect } from 'react';
import { Coords, Model, Relation, Types, Components as ComponentsTypes } from './Controller'
import { Stage, Layer } from 'react-konva'
import { ModelV } from './ModelV'
import { Components } from './Components';

import './App.css';


interface Controller {
  models: Model[],
  lines: any[]
}

const attributes =  [{label: 'Email', type: Types.String}, {label: 'Username', type: Types.String},
{label: 'Email', type: Types.String}, {label: 'Username', type: Types.String},
  ]

const model = new Model('User<class>', {x: 300, y: 100},  attributes)
const newModel = new Model('Agent', {x: 800, y: 20},  attributes)
const anotherModel = new Model('House', {x: 410, y: 300},  attributes)

model.addRelation(new Relation(newModel, [], 2))
model.addRelation(new Relation(anotherModel, [], 3))

function App() {

  const [controller, updateController] = useState<Controller>({
    models: [],
    lines: []
  })
  const updatePosition = (index: number, position: Coords) => {
      updateController((prev: Controller) => {
        prev.models[index].setPos(position)
        return {
          models: prev.models,
          lines:  []
        }
      })
  }
  const create = (comp: ComponentsTypes, pos: Coords) => {
      switch(comp){
        case ComponentsTypes.Model : 
          updateController({
            ...controller,
            models: [...controller.models, new Model('New Model', pos , attributes)]
          })
      }
  }


  return (
    <div className="App">
      <Stage width={window.innerWidth - 10} height={window.innerHeight - 10}>
        <Layer>
          {
            controller.models.map((model, i) => (
                <ModelV  
                    key={i}
                    label={model.label}
                    height={model.height}
                    width={model.width}
                    x={model.pos.x}
                    y={model.pos.y}
                    totalHeight={model.totalHeight}
                    attributes={model.attributes.map(att => `${att.label}: ${att.type}`)}
                    relations={model.relations}
                    update={updatePosition}
                    index={i}
                />
            ))
          }
        <Components
          callCreate={create}
        />
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
