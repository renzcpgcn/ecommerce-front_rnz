import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManageProduct from './ManageProduct';
import Header from './Header';
import './Design.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function myFunction() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("productTable");
    tr = table.getElementsByTagName("tr");
  
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function ProductDashboard() {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        axios.get('/api/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the products!", error);
            });
    }, []);

    const openModal = (product = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSaveProduct = (newProduct) => {
        if (editingProduct) {
            const updatedProduct = {
                ...editingProduct,
                price: newProduct.price,
                quantity: newProduct.quantity
            };

            axios.put(`/api/products/${editingProduct.id}`, updatedProduct)
                .then(response => {
                    setProducts(products.map(p => (p.id === editingProduct.id ? response.data : p)));
                    closeModal();
                })
                .catch(error => {
                    console.error("There was an error updating the product!", error);
                });
        } else {
            axios.post('/api/products', newProduct)
                .then(response => {
                    setProducts([...products, response.data]);
                    closeModal();
                })
                .catch(error => {
                    console.error("There was an error adding the product!", error);
                });
        }
    };

    const handleDeleteProduct = (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            axios.delete(`/api/products/${productId}`)
                .then(() => {
                    setProducts(products.filter(p => p.id !== productId));
                })
                .catch(error => {
                    console.error("There was an error deleting the product!");
                });
        }
    };

    const handleLogout = () => {
        
    };

    return (
        <>
            <Header onLogout={handleLogout}/>
            <div className="topnav">
                <button className="btn default float-end" id="addproduct" onClick={() => openModal()}>Add Product</button>
                <input type="text" id="myInput" onKeyUp={myFunction} placeholder="Search.." />
            </div>
            <div>
                <table id="productTable">
                    <thead>
                        <tr>
                            <th>Barcode</th>
                            <th>Product Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.barcode}</td>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.price}</td>
                                <td>{product.quantity}</td>
                                <td>{product.category}</td>
                                <td>
                                    <button onClick={() => openModal(product)}>Edit</button>
                                    <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isModalOpen && (
                    <ManageProduct
                        onClose={closeModal}
                        onSaveProduct={handleSaveProduct}
                        editingProduct={editingProduct}
                        existingProducts={products}
                    />
                )}
            </div>
        </>
    );
}

export default ProductDashboard;

