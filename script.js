// script.js - Enhanced Payroll Management System

// DOM elements
const employeeForm = document.getElementById('employee-form');
const employeeTableBody = document.getElementById('employee-tbody');
const emptyState = document.getElementById('empty-state');
const notification = document.getElementById('notification');
const submitButton = document.getElementById('submit-btn');

// State variables
let isEditing = false;
let currentEditId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Load existing employees from localStorage if available
    loadEmployees();
    
    // Update empty state visibility
    updateEmptyState();
});

// Event listeners
employeeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (isEditing) {
        updateEmployee();
    } else {
        addEmployee();
    }
    
    // Reset form and state
    employeeForm.reset();
    isEditing = false;
    submitButton.innerHTML = '<i class="fas fa-plus-circle"></i> Add Employee';
    submitButton.style.backgroundColor = '';
    
    // Show success notification
    showNotification();
});

// Function to add a new employee
function addEmployee() {
    // Get form values
    const name = document.getElementById('name').value.trim();
    const id = document.getElementById('id').value.trim();
    const department = document.getElementById('department').value.trim();
    const basicPay = document.getElementById('basic').value;
    const position = document.getElementById('position').value.trim();
    
    // Create employee object
    const employee = {
        name,
        id,
        department,
        basicPay,
        position,
        dateAdded: new Date().toISOString()
    };
    
    // Add to storage
    saveEmployee(employee);
    
    // Add to table
    addEmployeeToTable(employee);
    
    // Update empty state
    updateEmptyState();
}

// Function to update an existing employee
function updateEmployee() {
    const name = document.getElementById('name').value.trim();
    const id = document.getElementById('id').value.trim();
    const department = document.getElementById('department').value.trim();
    const basicPay = document.getElementById('basic').value;
    const position = document.getElementById('position').value.trim();
    
    // Get all employees
    let employees = getEmployees();
    
    // Find and update the employee
    const index = employees.findIndex(emp => emp.id === currentEditId);
    if (index !== -1) {
        employees[index] = {
            ...employees[index],
            name,
            id,
            department,
            basicPay,
            position,
            lastUpdated: new Date().toISOString()
        };
        
        // Save updated list
        localStorage.setItem('employees', JSON.stringify(employees));
        
        // Refresh table
        refreshEmployeeTable();
    }
    
    // Reset edit state
    currentEditId = null;
}

// Function to add an employee to the table
function addEmployeeToTable(employee) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', employee.id);
    
    row.innerHTML = `
        <td>${employee.name}</td>
        <td>${employee.id}</td>
        <td>${employee.department}</td>
        <td>${employee.position || 'N/A'}</td>
        <td>$${parseFloat(employee.basicPay).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
        <td class="action-buttons">
            <button class="btn-edit" onclick="editEmployee('${employee.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-danger" onclick="deleteEmployee('${employee.id}')">
                <i class="fas fa-trash-alt"></i>
            </button>
        </td>
    `;
    
    employeeTableBody.appendChild(row);
}

// Function to edit an employee
function editEmployee(id) {
    const employees = getEmployees();
    const employee = employees.find(emp => emp.id === id);
    
    if (employee) {
        // Set form values
        document.getElementById('name').value = employee.name;
        document.getElementById('id').value = employee.id;
        document.getElementById('department').value = employee.department;
        document.getElementById('basic').value = employee.basicPay;
        document.getElementById('position').value = employee.position || '';
        
        // Update state
        isEditing = true;
        currentEditId = id;
        
        // Update button
        submitButton.innerHTML = '<i class="fas fa-save"></i> Update Employee';
        submitButton.style.backgroundColor = '#f39c12';
        
        // Scroll to form
        document.getElementById('add-employee').scrollIntoView({ behavior: 'smooth' });
    }
}

// Function to delete an employee
function deleteEmployee(id) {
    if (confirm('Are you sure you want to remove this employee?')) {
        // Remove from storage
        let employees = getEmployees();
        employees = employees.filter(emp => emp.id !== id);
        localStorage.setItem('employees', JSON.stringify(employees));
        
        // Remove from table
        const row = employeeTableBody.querySelector(`tr[data-id="${id}"]`);
        if (row) {
            row.remove();
        }
        
        // Update empty state
        updateEmptyState();
        
        // Show notification
        showNotification('Employee removed successfully!');
    }
}

// Function to get employees from local storage
function getEmployees() {
    const employees = localStorage.getItem('employees');
    return employees ? JSON.parse(employees) : [];
}

// Function to save an employee to local storage
function saveEmployee(employee) {
    const employees = getEmployees();
    employees.push(employee);
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Function to load employees from storage to table
function loadEmployees() {
    const employees = getEmployees();
    employees.forEach(employee => {
        addEmployeeToTable(employee);
    });
}

// Function to refresh the employee table
function refreshEmployeeTable() {
    // Clear table
    employeeTableBody.innerHTML = '';
    
    // Reload employees
    loadEmployees();
    
    // Update empty state
    updateEmptyState();
}

// Function to update empty state visibility
function updateEmptyState() {
    if (employeeTableBody.children.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

// Function to show notification
function showNotification(message) {
    notification.textContent = message || 'Employee data saved successfully!';
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}