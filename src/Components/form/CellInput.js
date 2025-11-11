import React from 'react'
import PhoneInput from 'react-phone-input-2'
import { Box } from '@mui/material'

const CellInput = ({state, name, setState, label}) => {    
  return (
    <Box sx={{ width: '100%' }}>
      {/* Text Field for the Contact */}
      <PhoneInput
        name={name || "Contact Number"}
        country={'pk'}
        masks={{pk: '...-.......'}}
        placeholder="+92 300-1234567"
        value={state[name] || state.contact || ''}
        onChange={contact => setState({...state, [name]: contact })}
        inputStyle={{
          width: '100%',
          height: '40px',
          fontSize: '14px',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          paddingLeft: '48px'
        }}
        buttonStyle={{
          border: '1px solid #d1d5db',
          borderRadius: '4px 0 0 4px',
          backgroundColor: '#fff'
        }}
        containerStyle={{
          width: '100%'
        }}
      />
    </Box>
  )
}

export default CellInput