import React, { ChangeEvent } from 'react'

interface FormFieldProps
{
  id:string,
  label:string,
  type?:string,
  value:string,
  placeholder?:string,
  as?:'input'|'text-area'|'select',
  onChange:(e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>void,
  options?:Array<{value:string,label:string}>
}



const FormField = ({id,label,type="text",value,placeholder,as='input',onChange,options=[]}:FormFieldProps) => {
  return (
    <div className='form-field'>
      <label htmlFor={id}>{label}</label>
      { as==='text-area'?(<textarea id={id} name={id} value={value} onChange={onChange} placeholder={placeholder}></textarea>
      ):as==='select'?(<select id={id} name={id} value={value} onChange={onChange} >{options.map(({label,value})=>(<option key={value} value={value}>{label}</option>))}</select>
    ):(<input id={id} name={id} value={value??""} onChange={onChange} placeholder={placeholder} ></input>)}
    </div>
  )
}

export default FormField