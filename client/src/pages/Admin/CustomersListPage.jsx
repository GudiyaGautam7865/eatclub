import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers, deleteCustomer } from '../../services/adminCustomersService';
import './styles/CustomersListPage.css';

export default function CustomersListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ field: 'name', dir: 'asc' });
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getCustomers({
          page,
          limit: pageSize,
          search,
          sortField: sort.field,
          sortDir: sort.dir,
        });
        setRows(res.data || []);
        const totalCount = res.total ?? 0;
        setTotal(totalCount);
      } catch (err) {
        setError(err.message || 'Failed to load customers');
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, search, sort]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const toggleSort = (field) => {
    setPage(1);
    setSort((prev) => {
      if (prev.field === field) {
        return { field, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
      }
      return { field, dir: 'asc' };
    });
  };

  const sortIcon = (field) => {
    if (sort.field !== field) return '⇅';
    return sort.dir === 'asc' ? '↑' : '↓';
  };

  const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : '—');
  const formatCurrency = (v) => `₹${Number(v || 0).toLocaleString('en-IN')}`;

  const handleDelete = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(customerId);
      await deleteCustomer(customerId);
      setRows((prev) => prev.filter((c) => c.id !== customerId));
      setOpenDropdown(null);
    } catch (err) {
      setError('Failed to delete customer: ' + (err.message || 'Unknown error'));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="customers-page">
      <div className="customers-header">
        <div>
          <p className="eyebrow">Customers</p>
          <h1>Customer Directory</h1>
          <p className="subtitle">Search, sort, and drill into customer activity.</p>
        </div>
        <div className="actions">
          <input
            className="search-input"
            placeholder="Search by name, email, phone"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div className="customers-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleSort('name')}>Name <span className="sort">{sortIcon('name')}</span></th>
                <th onClick={() => toggleSort('email')}>Email <span className="sort">{sortIcon('email')}</span></th>
                <th onClick={() => toggleSort('phone')}>Phone <span className="sort">{sortIcon('phone')}</span></th>
                <th onClick={() => toggleSort('totalOrders')}>Total Orders <span className="sort">{sortIcon('totalOrders')}</span></th>
                <th onClick={() => toggleSort('totalSpend')}>Total Spend <span className="sort">{sortIcon('totalSpend')}</span></th>
                <th onClick={() => toggleSort('lastOrderDate')}>Last Order <span className="sort">{sortIcon('lastOrderDate')}</span></th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="cell-name">{c.name}</div>
                  </td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.totalOrders}</td>
                  <td>{formatCurrency(c.totalSpend)}</td>
                  <td>{formatDate(c.lastOrderDate)}</td>
                  <td>
                    <span className={`status-pill ${c.status?.toLowerCase() || 'neutral'}`}>
                      {c.status || '—'}
                    </span>
                  </td>
                  <td>
                    <div className="action-dropdown">
                      <button
                        className="action-menu-btn"
                        onClick={() => setOpenDropdown(openDropdown === c.id ? null : c.id)}
                      >
                        ⋮
                      </button>
                      {openDropdown === c.id && (
                        <div className="dropdown-menu">
                          <button
                            className="dropdown-item view"
                            onClick={() => {
                              navigate(`/admin/customer-detail/${c.id}`);
                              setOpenDropdown(null);
                            }}
                          >
                            👁️ View Details
                          </button>
                          <button
                            className="dropdown-item delete"
                            disabled={deleting === c.id}
                            onClick={() => handleDelete(c.id)}
                          >
                            🗑️ {deleting === c.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="empty-state">No customers found.</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={8} className="empty-state">Loading customers…</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
        </div>
        {error && <div className="error-text">{error}</div>}
      </div>
    </div>
  );
}
