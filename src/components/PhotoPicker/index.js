import React, { Component } from 'react'


import './assets/module.css'
import photoPickerIcon from './assets/photoPicker.png'


/**
 * @template
 * @prop {canChange} 是否可以更改
 * @prop {imgSrc} 图片显示路径
 */
class PhotoPicker extends Component{
    constructor() {
        super(...arguments)
        this.change = this.change.bind(this)
    }

    change(e) {
        var reader = new FileReader()
        try{
            let file = e.target.files[0]
            reader.readAsDataURL(e.target.files[0], "UTF-8")
            reader.onload = (evt) => { 
                this.props.changePhoto(file, evt.target.result)
            }
        }
        catch(e) {
            // Toast.fail('请选择图片',1)
            return  
        }

    }



    render() {
        const { canChange, imgSrc, title } = this.props


        return(
            <div className="assets_add_photo">
                {
                    canChange &&
                    <input type="file" className="assets_file_input "
                        onChange={this.change}
                        accept="image/*"
                    />
                }

                {
                    canChange &&
                    this.props.text
                }
                <img src={imgSrc || photoPickerIcon} />
            </div>
        )
    }
}


export default PhotoPicker