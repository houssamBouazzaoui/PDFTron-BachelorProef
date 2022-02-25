import React, { useRef, useEffect, useState } from 'react';
import WebViewer, { getInstance } from '@pdftron/webviewer';
import './App.css';
import TextField from '@material-ui/core/TextField';

const App = () => {
  const viewer = useRef(null);
  const [data,setData]= useState([]);
  const [changedData,setChangedData] = useState();
  const [inst,setInst] = useState();
  /*const jsonData = {
    COMPANYNAME: 'PDFTron',
    CUSTOMERNAME: 'Andrey Safonov',
    CompanyAddressLine1: '838 W Hastings St 5th floor',
    CompanyAddressLine2: 'Vancouver, BC V6C 0A6',
    CustomerAddressLine1: '123 Main Street',
    CustomerAddressLine2: 'Vancouver, BC V6A 2S5',
    Date: 'Nov 5th, 2021',
    ExpiryDate: 'Dec 5th, 2021',
    QuoteNumber: '134',
    WEBSITE: 'www.pdftron.com',
    billed_items: {
      insert_rows: [
        ['Apples', '3', '$5.00', '$15.00'],
        ['Oranges', '2', '$5.00', '$10.00'],
      ],
    },
    days: '30',
    total: '$25.00',
  };*/

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        preloadWorker:'office',
        initialDoc:'/files/quote.docx'
      },
      viewer.current
    ).then( async (instance) => {
      

      const { documentViewer } = instance.Core;
      setInst(documentViewer)
        documentViewer.addEventListener('documentLoaded', async () => {
          
          await documentViewer.getDocument().documentCompletePromise();
          documentViewer.updateView();
          
          console.log(documentViewer.getDocument())

          const doc = documentViewer.getDocument();
          const keys = doc.getTemplateKeys();
    
          keys.then(value=>{setData(value)})
          //console.log(changedData)
          // if(changedData != null)
          //   await documentViewer.getDocument().applyTemplateValues(changedData)
        });
    });
  },[]);

const handleChange = e => {
  const json =  {[e.target.id]:e.target.value}
  //setChangedData(json);
  //console.log(inst.getDocument())
  console.log(json)
  inst.getDocument().applyTemplateValues(json);
  

};

  return (
      <div className='App'>
        <div className='header'>React sample</div>
        <div className='container'>
          <div className='webviewer' ref={viewer}></div>
          <div className='variabele'>
            {data.map(el=>
              <TextField
                key={el}
                id={el}
                label={el}
                type="string"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange.bind(el)}
              />
            )}
          </div>
        </div>
      </div>
  );
};



export default App;
