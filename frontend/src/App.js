import React, {useEffect, useState, useRef} from 'react';
import Axios from 'axios'
import './App.css';
import {Table, Input, Button} from 'reactstrap'
import {APIURL, APIIMAGE} from './helper/apiurl'
import Modal from './components/modal'

function App() {

  const [datausers, setdatauser]=useState([])
  const [datausersedit, setdatauseredit]=useState([])
  const [datausersdelete, setdatauserdelete]=useState([])

  const [modal, setModal] = useState(false)
  const toggle = ()=> {setModal(!modal)}

  const [modaledit, setModaledit] = useState(false)
  const toggleedit = ()=> {setModaledit(!modaledit)}

  const [modaldelete, setModaldelete] = useState(false)
  const toggledelete = ()=> {setModaldelete(!modaldelete)}

  const editoggle = (index)=> {
    setdatauseredit(datausers[index])
    setModaledit(!modaledit)
  }

  const deleteoggle = (index)=> {
    setdatauserdelete(datausers[index])
    setModaldelete(!modaldelete)
  }


  const [addData]=useState({
    nama:useRef(),
    email:useRef()
  })


  const [addImage, setaddimagefile] = useState({
    addimageFileName:'Pilih Gambar...',
    addImageFile:undefined,
  });

  const onAddImageFileChange=(event)=>{
    // console.log(document.getElementById('addImagePost').files[0])
    console.log(event.target.files[0])
    var file=event.target.files[0]
    if(file){
      setaddimagefile({...addImage,addImageFileName:file.name,addImageFile:event.target.files[0]})
    }else{
      setaddimagefile({...addImage,addImageFileName:'Select Image...',addImageFile:undefined})
    }
  }

  useEffect(()=>{
    Axios.get(`${APIURL}users/user`)
    .then(res=>{
      setdatauser(res.data.datauser)
    })
    .catch(err=>{
      console.log(err)
    })
  },[])

  const addUser=()=>{

    var formdata=new FormData()

    const {nama, email}=addData
    const data={
      nama:nama.current.value,
      email:email.current.value
    }
    var Headers={
      headers: 
      {
        'Content-Type':'multipart/form-data',
      }
    }

    formdata.append('image', addImage.addImageFile)
    formdata.append('data',JSON.stringify(data))
    Axios.post(`${APIURL}users/register`,formdata, Headers)
    .then((res)=>{
      setdatauser(res.data.datauser)
      setModal(!modal)
    }).catch((err)=>{
      console.log(err)
    })
  }

  

  const editUser=()=>{

    const data={
      nama:datausersedit.nama,
      email:datausersedit.email
    }


    Axios.put(`${APIURL}users/edituser/${datausersedit.id}`,data)
    .then((res)=>{
      setdatauser(res.data.datauser)
      setModaledit(!modaledit)
    }).catch((err)=>{
      console.log(err)
    })
  }

  const deleteUser=()=>{
    Axios.delete(`${APIURL}users/user/${datausersdelete.id}`)
    .then((res)=>{
      setdatauser(res.data.datauser)
      setModaldelete(!modaldelete)
    }).catch((err)=>{
      console.log(err)
    })
  }





  const renderUser=()=>{
    return datausers.map((val,index)=>{
      return (

        <tr key={index}>
          <th scope="row">{index+1}</th>
          <td>{val.nama}</td>
          <td>{val.email}</td>
          <td><img src={`${APIIMAGE+val.image}`}/></td>  
          <td>
            <Button onClick={()=>editoggle(index)} className='mr-2'>Edit</Button>
            <Button onClick={()=>deleteoggle(index)} >Delete</Button>
          </td>       
        </tr>

      )
    })
  }

  if(datausers.length===0) {
    return <div>loading...</div>
  }

  return (
    <div>

    <Modal title='Add User' toggle={toggle} modal={modal} actionfunc={addUser} >
      <Input className='mb-2' type='text' placeholder="tulis nama user"  innerRef={addData.nama} />
      <Input type='text' placeholder="tulis email" innerRef={addData.email}  />
      <Input type='file' label={addImage.addimageFileName} id='addImagePost' className='mt-2' onChange={onAddImageFileChange} />
    </Modal>

    <Modal title='Edit User' toggle={toggleedit} modal={modaledit} actionfunc={editUser}  >
      <Input className='mb-2' type='text' placeholder="tulis nama user" value={datausersedit.nama} onChange={e=>setdatauseredit({...datausersedit, nama:e.target.value})}  />
      <Input type='text' placeholder="tulis email" value={datausersedit.email} onChange={e=>setdatauseredit({...datausersedit, email:e.target.value})} />
    </Modal>

    <Modal title='Delete User' toggle={toggledelete} modal={modaldelete} actionfunc={deleteUser}  >
      Yakin mau delete data?
    </Modal>

    <Button variant='danger' onClick={toggle} >Add User</Button>

     <Table>  
      <thead>
        <tr>
          <th>NO</th>
          <th>Nama</th>
          <th>Email</th>
          <th>Gambar</th>
          <th>action</th>
        </tr>
      </thead>
      <tbody>

        {renderUser()}
        
      </tbody>
    </Table>
    </div>
  );
}

export default App;
