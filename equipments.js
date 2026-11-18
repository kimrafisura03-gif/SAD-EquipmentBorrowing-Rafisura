
import { supabase } from "./supabase.js";

// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    loadEquipment();
    loadUserEmail();

    const equipmentForm = document.getElementById("equipmentForm");

    if (equipmentForm) {
        equipmentForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await addEquipment();
        });
    }

    const search = document.getElementById("equipmentSearch");
    const filter = document.getElementById("availabilityFilter");

    if (search) {
        search.addEventListener("input", loadEquipment);
    }

    if (filter) {
        filter.addEventListener("change", loadEquipment);
    }

    // Refresh when borrowing or returning equipment
    window.addEventListener("equipmentChanged", loadEquipment);
});

// ==========================================
// LOAD USER EMAIL
// ==========================================

async function loadUserEmail() {
    const emailElement = document.getElementById("userEmail");

    if (!emailElement) return;

    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        emailElement.textContent = "Not logged in";
        return;
    }

    emailElement.textContent = data.user.email;
}

// ==========================================
// LOAD EQUIPMENT
// ==========================================

async function loadEquipment() {
    const tableBody = document.getElementById("equipmentTableBody");
    const dashboardBody = document.getElementById("dashboardEquipmentBody");

    const { data, error } = await supabase
        .from("equipment")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error("Load equipment error:", error);

        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        Error loading equipment: ${escapeHtml(error.message)}
                    </td>
                </tr>
            `;
        }

        if (dashboardBody) {
            dashboardBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        Error loading equipment.
                    </td>
                </tr>
            `;
        }

        return;
    }

    const allEquipment = data || [];

    // ======================================
    // SEARCH AND FILTER
    // ======================================

    const searchInput = document.getElementById("equipmentSearch");
    const filterInput = document.getElementById("availabilityFilter");

    const searchText = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const availability = filterInput
        ? filterInput.value
        : "All";

    const filteredEquipment = allEquipment.filter(item => {

        const matchesSearch =
            (item.equipment_name || "").toLowerCase().includes(searchText) ||
            (item.category || "").toLowerCase().includes(searchText) ||
            (item.asset_code || "").toLowerCase().includes(searchText);

        // FIX: All means no availability restriction
        const matchesAvailability =
            availability === "All" ||
            !availability ||
            item.availability === availability;

        return matchesSearch && matchesAvailability;
    });

    // ======================================
    // DISPLAY EQUIPMENT TABLE
    // ======================================

    if (tableBody) {
        tableBody.innerHTML = "";

        if (filteredEquipment.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6">No equipment found.</td>
                </tr>
            `;
        } else {
            filteredEquipment.forEach(item => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${escapeHtml(item.asset_code)}</td>
                        <td>${escapeHtml(item.equipment_name)}</td>
                        <td>${escapeHtml(item.category)}</td>
                        <td>${escapeHtml(item.condition || "Good")}</td>
                        <td>${escapeHtml(item.availability || "Available")}</td>
                        <td>
                            <button onclick="deleteEquipment(${item.id})">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;
            });
        }
    }

    // ======================================
    // DISPLAY DASHBOARD RECENT EQUIPMENT
    // ======================================

    if (dashboardBody) {
        dashboardBody.innerHTML = "";

        if (allEquipment.length === 0) {
            dashboardBody.innerHTML = `
                <tr>
                    <td colspan="5">No equipment records yet.</td>
                </tr>
            `;
        } else {
            allEquipment.slice(0, 5).forEach(item => {
                dashboardBody.innerHTML += `
                    <tr>
                        <td>${escapeHtml(item.asset_code)}</td>
                        <td>${escapeHtml(item.equipment_name)}</td>
                        <td>${escapeHtml(item.category)}</td>
                        <td>${escapeHtml(item.condition || "Good")}</td>
                        <td>${escapeHtml(item.availability || "Available")}</td>
                    </tr>
                `;
            });
        }
    }

    // ======================================
    // UPDATE DASHBOARD STATISTICS
    // ======================================

    updateEquipmentStats(allEquipment);

    // ======================================
    // UPDATE BORROWING DROPDOWN
    // ======================================

    const borrowEquipment = document.getElementById("borrowEquipment");

    if (borrowEquipment) {
        const previousValue = borrowEquipment.value;

        const availableEquipment = allEquipment.filter(
            item => item.availability === "Available"
        );

        borrowEquipment.innerHTML =
            `<option value="">Select Available Equipment</option>`;

        availableEquipment.forEach(item => {
            borrowEquipment.innerHTML += `
                <option value="${item.id}">
                    ${escapeHtml(item.equipment_name)}
                    - ${escapeHtml(item.asset_code)}
                </option>
            `;
        });

        if (availableEquipment.some(item => String(item.id) === previousValue)) {
            borrowEquipment.value = previousValue;
        }
    }

    // Update overdue count
    await updateOverdueStats();
}

// ==========================================
// ADD EQUIPMENT
// ==========================================

async function addEquipment() {

    const name = document.getElementById("equipmentName").value.trim();
    const category = document.getElementById("equipmentCategory").value;
    const assetCode = document.getElementById("assetCode").value.trim();
    const condition = document.getElementById("equipmentCondition").value;

    const message = document.getElementById("equipmentMessage");

    if (!name || !category || !assetCode) {
        showMessage(message, "Please fill in all required fields.", "error");
        return;
    }

    const { data: { user }, error: authError } =
        await supabase.auth.getUser();

    if (authError || !user) {
        showMessage(message, "You are not logged in.", "error");
        return;
    }

    const { data, error } = await supabase
        .from("equipment")
        .insert({
            equipment_name: name,
            category: category,
            asset_code: assetCode,
            condition: condition || "Good",
            availability: "Available"
        })
        .select()
        .single();

    if (error) {
        console.error("ADD EQUIPMENT ERROR:", error);

        showMessage(
            message,
            "Failed to add equipment: " + error.message,
            "error"
        );

        return;
    }

    console.log("Equipment added successfully:", data);

    document.getElementById("equipmentForm").reset();

    showMessage(message, "Equipment added successfully!", "success");

    // Immediately refresh dashboard and equipment
    await loadEquipment();

    alert("Equipment added successfully!");
}

// ==========================================
// DELETE EQUIPMENT
// ==========================================

async function deleteEquipment(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this equipment?"
    );

    if (!confirmed) return;

    const { error } = await supabase
        .from("equipment")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Delete error:", error);

        alert("Failed to delete equipment: " + error.message);
        return;
    }

    alert("Equipment deleted successfully!");

    await loadEquipment();
}

// ==========================================
// DASHBOARD EQUIPMENT STATISTICS
// ==========================================

function updateEquipmentStats(equipment) {

    const total = equipment.length;

    const available = equipment.filter(
        item => item.availability === "Available"
    ).length;

    const borrowed = equipment.filter(
        item => item.availability === "Borrowed"
    ).length;

    document.getElementById("totalEquipment").textContent = total;
    document.getElementById("availableEquipment").textContent = available;
    document.getElementById("borrowedEquipment").textContent = borrowed;
}

// ==========================================
// OVERDUE STATISTICS
// ==========================================

async function updateOverdueStats() {

    const overdueElement = document.getElementById("overdueEquipment");

    if (!overdueElement) return;

    const today = getLocalDate();

    const { data, error } = await supabase
        .from("borrow_transactions")
        .select("id, due_date, date_returned, status");

    if (error) {
        console.error("Overdue statistics error:", error.message);
        return;
    }

    const overdueCount = (data || []).filter(transaction => {

        return (
            !transaction.date_returned &&
            transaction.status !== "Returned" &&
            transaction.due_date < today
        );

    }).length;

    overdueElement.textContent = overdueCount;
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getLocalDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function showMessage(element, text, type) {
    if (!element) return;

    element.textContent = text;
    element.className = "message " + type;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Make delete function available to HTML
window.deleteEquipment = deleteEquipment;
