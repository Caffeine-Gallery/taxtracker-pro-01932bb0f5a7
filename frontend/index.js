import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    await loadTaxPayers();
    setupForm();
    setupSearch();
});

async function loadTaxPayers() {
    showLoading();
    try {
        const taxPayers = await backend.getAllTaxPayers();
        displayTaxPayers(taxPayers);
    } catch (error) {
        console.error('Error loading tax payers:', error);
    } finally {
        hideLoading();
    }
}

function displayTaxPayers(taxPayers) {
    const listElement = document.getElementById('taxPayerList');
    listElement.innerHTML = '';
    taxPayers.forEach(taxPayer => {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${taxPayer.tid}</h5>
                <p class="card-text">Name: ${taxPayer.firstName} ${taxPayer.lastName}</p>
                <p class="card-text">Address: ${taxPayer.address}</p>
            </div>
        `;
        listElement.appendChild(card);
    });
}

function setupForm() {
    const form = document.getElementById('addTaxPayerForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tid = document.getElementById('tid').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const address = document.getElementById('address').value;

        showLoading();
        try {
            await backend.addTaxPayer(tid, firstName, lastName, address);
            form.reset();
            await loadTaxPayers();
        } catch (error) {
            console.error('Error adding tax payer:', error);
        } finally {
            hideLoading();
        }
    });
}

function setupSearch() {
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', async () => {
        const tid = document.getElementById('searchTid').value;
        showLoading();
        try {
            const taxPayer = await backend.getTaxPayer(tid);
            displaySearchResult(taxPayer);
        } catch (error) {
            console.error('Error searching tax payer:', error);
            displaySearchResult(null);
        } finally {
            hideLoading();
        }
    });
}

function displaySearchResult(taxPayer) {
    const resultElement = document.getElementById('searchResult');
    if (taxPayer) {
        resultElement.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${taxPayer.tid}</h5>
                    <p class="card-text">Name: ${taxPayer.firstName} ${taxPayer.lastName}</p>
                    <p class="card-text">Address: ${taxPayer.address}</p>
                </div>
            </div>
        `;
    } else {
        resultElement.innerHTML = '<p>No TaxPayer found with that TID.</p>';
    }
}

function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}
