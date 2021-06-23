import React, { useState, useEffect } from 'react';
import { Coords, Model, Relation, Types, Components as ComponentsTypes } from './Controller'
import { Stage, Layer } from 'react-konva'
import { ModelV } from './ModelV'
import { Components } from './Components';
import { cloneDeep } from 'lodash'

import './App.css';


interface Controller {
  models: Model[],
  lines: any[],
}
const attributes =  [{label: 'Email', type: Types.String}, {label: 'Username', type: Types.String}]

function App() {

  
  const [controller, updateController] = useState<Controller>({
    models: [],
    lines: []
  })

  const contained = (pos: Coords) => {
        let res : Model | null = null
        controller.models.forEach(model => {
        if(model.contained(pos)){
          res = model
        }
      })
        return res
  }

  const update = () => {
    updateController((prev: Controller) => {
      return {
        ...prev,
        models: [...controller.models],
        lines: [...controller.lines]
      }
    })
  }

  useEffect(()=>{
    controller.models.forEach(model => {
      model.registerObserver(update)
    })
  }, [controller.models])


  const create = (comp: ComponentsTypes, pos: Coords) => {
    const m = new Model(`Model~#${controller.models.length}`, pos , cloneDeep(attributes)) 
    if(controller.models.length > 0 && Math.random() > .75) m.addRelation(new Relation(controller.models[controller.models.length - 1], [], 1))
    switch(comp){
        case ComponentsTypes.Model : 
          updateController({
            ...controller,
            models: [...controller.models, m]
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
                    model={model}
                    contained={contained}
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
