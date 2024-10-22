import React, { useState, useEffect } from 'react';
import './Design.css';

function ManageProduct({ onClose, onSaveProduct, editingProduct, existingProducts }) {
    const [formData, setFormData] = useState({ barcode: '', name: '', description: '', price: '', quantity: '', category: '' });
    const [errors, setErrors] = useState({});

    
    useEffect(() => {
        if (editingProduct) {
            setFormData({
                barcode: editingProduct.barcode, 
                name: editingProduct.name,
                description: editingProduct.description,
                price: editingProduct.price,
                quantity: editingProduct.quantity,
                category: editingProduct.category,
            });
        } else {
            setFormData({ barcode: '', name: '', description: '', price: '', quantity: '', category: '' });
        }
    }, [editingProduct]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const errors = {};
        if (!editingProduct) {
            if (!formData.barcode) errors.barcode = 'Barcode is required';
            else if (existingProducts.some(product => product.barcode === formData.barcode)) {
                errors.barcode = 'Barcode must be unique';
            }
            if (!formData.name) errors.name = 'Product name is required';
            if (!formData.description) errors.description = 'Description is required';
            if (!formData.category) errors.category = 'Category is required';
        }
        
        if (!formData.price) errors.price = 'Price is required';
        if (!formData.quantity) errors.quantity = 'Quantity is required';
        return errors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            const productData = editingProduct
                ? { ...editingProduct, price: formData.price, quantity: formData.quantity }
                : { ...formData };
            onSaveProduct(productData);
            setFormData({ barcode: '', name: '', description: '', price: '', quantity: '', category: '' });
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit}>
                    {!editingProduct && (
                        <>
                            <div>
                                <label>Barcode:</label><br />
                                <input type="number" name="barcode" value={formData.barcode} onChange={handleChange} />
                                {errors.barcode && <span style={{ color: 'red' }}>{errors.barcode}</span>}
                            </div>
                            <div>
                                <label>Product Name:</label><br />
                                <input type="text" name="name"  value={formData.name} onChange={handleChange} />
                                {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
                            </div>
                            <div>
                                <label>Description:</label><br />
                                <input type="text" name="description" value={formData.description} onChange={handleChange} />
                                {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}
                            </div>
                            <div>
                                <label>Category:</label><br />
                                <input type="text" name="category" value={formData.category} onChange={handleChange} />
                                {errors.category && <span style={{ color: 'red' }}>{errors.category}</span>}
                            </div>
                        </>
                    )}
                    <div>
                        <label>Price:</label><br />
                        <input type="number" name="price" value={formData.price} onChange={handleChange} />
                        {errors.price && <span style={{ color: 'red' }}>{errors.price}</span>}
                    </div>
                    <div>
                        <label>Quantity:</label><br />
                        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
                        {errors.quantity && <span style={{ color: 'red' }}>{errors.quantity}</span>}
                    </div>
                    <br />
                    <button type="submit">{editingProduct ? 'Save Changes' : 'Add Product'}</button>
                </form>
            </div>
        </div>
    );
}

export default ManageProduct;
