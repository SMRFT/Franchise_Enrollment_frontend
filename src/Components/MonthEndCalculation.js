import React, { useState, useEffect } from "react";
import styled from "styled-components"

// Styled Components
const Container = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #219C9C, #1A7A7A);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  font-weight: 300;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  &:focus {
    border-color: #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;
  &:focus {
    border-color: #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #219C9C, #1A7A7A);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  &:disabled {
    background: #ced4da;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin: 15px 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  &::before {
    content: '✅';
    font-size: 1.2rem;
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin: 15px 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  &::before {
    content: '⚠️';
    font-size: 1.2rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #219C9C, #1A7A7A);
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  &:hover {
    background-color: #e3f2fd;
    transition: background-color 0.2s ease;
  }
`;

const TableHeaderCell = styled.th`
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  font-size: 0.95rem;
  color: #495057;
`;

const BalanceCell = styled(TableCell)`
  font-weight: 700;
  text-align: right;
  color: ${props => props.negative ? '#dc3545' : '#28a745'};
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' 
    : 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'};
  color: white;
`;

const ActionButton = styled(Button)`
  padding: 8px 16px;
  font-size: 14px;
  ${props => props.small && `
    padding: 6px 12px;
    font-size: 12px;
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
  &::before {
    content: '📋';
    font-size: 4rem;
    display: block;
    margin-bottom: 20px;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #219C9C;
`;

const SelectionInfo = styled.div`
  background: #e3f2fd;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 15px;
  color: #495057;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  &::before {
    content: 'ℹ️';
  }
`;

const MonthEndCalculation = () => {
  
  const franchiseurl = process.env.REACT_APP_BACKEND_FRANCHISE_BASE_URL;


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowLoading, setRowLoading] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFranchises, setSelectedFranchises] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${franchiseurl}monthend/`);
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error("Error fetching month-end data:", error);
      setMessage("Error fetching data");
      setMessageType("error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleUpdateClick = async () => {
    setLoading(true);
    setMessage("");
    setMessageType("");
    try {
      const response = await fetch(`${franchiseurl}monthend/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      setMessage(result.message || "Wallet balances updated successfully");
      setMessageType("success");
      setData(result.data);
      setSelectedFranchises([]);
    } catch (error) {
      console.error("Error updating wallets:", error);
      setMessage("Error updating wallet balances");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleRowUpdateClick = async (franchiseId, month, year) => {
    const key = `${franchiseId}-${month}-${year}`;
    setRowLoading(prev => ({ ...prev, [key]: true }));
    setMessage("");
    setMessageType("");
    try {
      const response = await fetch(`${franchiseurl}monthend/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          franchise_id: franchiseId,
          month: month,
          year: year
        })
      });
      const result = await response.json();
      setMessage(result.message || `Franchise ${franchiseId} closed successfully`);
      setMessageType("success");
      setData(result.data);
      setSelectedFranchises(prev => prev.filter(id => id !== franchiseId));
    } catch (error) {
      console.error("Error closing franchise:", error);
      setMessage(`Error closing franchise ${franchiseId}`);
      setMessageType("error");
    } finally {
      setRowLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleBatchClose = async () => {
    if (selectedFranchises.length === 0) return;
    
    setLoading(true);
    setMessage("");
    setMessageType("");
    
    const [year, month] = selectedMonth.split('-');
    
    try {
      for (const franchiseId of selectedFranchises) {
        const key = `${franchiseId}-${month}-${year}`;
        setRowLoading(prev => ({ ...prev, [key]: true }));
        
        await fetch(`${franchiseurl}monthend/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            franchise_id: franchiseId,
            month: parseInt(month),
            year: parseInt(year)
          })
        });
        
        setRowLoading(prev => ({ ...prev, [key]: false }));
      }
      
      const response = await fetch(`${franchiseurl}monthend/`);
      const result = await response.json();
      setData(result.data);
      setMessage(`Successfully closed ${selectedFranchises.length} franchise(s)`);
      setMessageType("success");
      setSelectedFranchises([]);
    } catch (error) {
      console.error("Error closing franchises:", error);
      setMessage("Error closing selected franchises");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setSelectedFranchises([]);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setSelectedFranchises([]);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedFranchises([]);
  };

  const filteredData = data.filter(item => {
    if (!selectedMonth) return false;
    const [year, month] = selectedMonth.split('-');
    const matchesMonth = item.year === parseInt(year) && item.month === parseInt(month);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch = !searchQuery || item.franchise_id.toString().includes(searchQuery);
    return matchesMonth && matchesStatus && matchesSearch;
  });

  const allActive = filteredData.length > 0 && filteredData.every(item => item.status === 'active');
  const hasActiveFranchise = filteredData.some(item => item.status === 'active');
  const activeFranchises = filteredData.filter(item => item.status === 'active');

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedFranchises(activeFranchises.map(item => item.franchise_id));
    } else {
      setSelectedFranchises([]);
    }
  };

  const handleSelectFranchise = (franchiseId) => {
    setSelectedFranchises(prev => {
      if (prev.includes(franchiseId)) {
        return prev.filter(id => id !== franchiseId);
      } else {
        return [...prev, franchiseId];
      }
    });
  };

  const isAllSelected = activeFranchises.length > 0 && 
    activeFranchises.every(item => selectedFranchises.includes(item.franchise_id));

  return (
    <Container>
      <Header>
        <Title>Month-End Calculation</Title>
      </Header>

      <Card>
        <FormGrid>
          <InputGroup>
            <Label>Select Month</Label>
            <Input 
              type="month" 
              value={selectedMonth}
              onChange={handleMonthChange}
            />
          </InputGroup>
          
          <InputGroup>
            <Label>Status Filter</Label>
            <Select value={statusFilter} onChange={handleStatusFilterChange}>
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="closed">Closed Only</option>
            </Select>
          </InputGroup>

          <InputGroup>
            <Label>Search Franchise ID</Label>
            <Input 
              type="text" 
              placeholder="Enter franchise ID..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </FormGrid>

        {selectedFranchises.length > 0 && (
          <SelectionInfo>
            {selectedFranchises.length} franchise(s) selected
          </SelectionInfo>
        )}

        <ButtonGroup>
          {allActive && (
            <Button 
              onClick={handleUpdateClick} 
              disabled={loading}
            >
              {loading ? "Processing..." : "Month End Closing (All Franchises)"}
            </Button>
          )}

          {selectedFranchises.length > 0 && (
            <Button 
              onClick={handleBatchClose} 
              disabled={loading}
            >
              {loading ? "Processing..." : `Close Selected (${selectedFranchises.length})`}
            </Button>
          )}
        </ButtonGroup>

        {message && (
          messageType === "error" ? (
            <ErrorMessage>{message}</ErrorMessage>
          ) : (
            <SuccessMessage>{message}</SuccessMessage>
          )
        )}

        <Table>
          <TableHeader>
            <tr>
              {hasActiveFranchise && (
                <TableHeaderCell style={{textAlign: 'center', width: '50px'}}>
                  <Checkbox 
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    disabled={activeFranchises.length === 0}
                  />
                </TableHeaderCell>
              )}
              <TableHeaderCell>Franchise ID</TableHeaderCell>
              <TableHeaderCell style={{textAlign: 'center'}}>Month</TableHeaderCell>
              <TableHeaderCell style={{textAlign: 'center'}}>Year</TableHeaderCell>
              <TableHeaderCell style={{textAlign: 'right'}}>Total Revenue (₹)</TableHeaderCell>
              <TableHeaderCell style={{textAlign: 'right'}}>Franchiser Share (₹)</TableHeaderCell>
              <TableHeaderCell style={{textAlign: 'right'}}>Wallet Balance (₹)</TableHeaderCell>
              <TableHeaderCell style={{textAlign: 'right'}}>New Wallet</TableHeaderCell>
              <TableHeaderCell style={{textAlign: 'center'}}>Status</TableHeaderCell>
              <TableHeaderCell style={{textAlign: 'center'}}>Action</TableHeaderCell>
            </tr>
          </TableHeader>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const key = `${item.franchise_id}-${item.month}-${item.year}`;
                const isRowLoading = rowLoading[key];
                const isActive = item.status === 'active';
                const isSelected = selectedFranchises.includes(item.franchise_id);
                
                return (
                  <TableRow key={key}>
                    {hasActiveFranchise && (
                      <TableCell style={{textAlign: 'center'}}>
                        {isActive && (
                          <Checkbox 
                            checked={isSelected}
                            onChange={() => handleSelectFranchise(item.franchise_id)}
                          />
                        )}
                      </TableCell>
                    )}
                    <TableCell style={{fontWeight: 600}}>{item.franchise_id}</TableCell>
                    <TableCell style={{textAlign: 'center'}}>{item.month}</TableCell>
                    <TableCell style={{textAlign: 'center'}}>{item.year}</TableCell>
                    <TableCell style={{textAlign: 'right'}}>{Number(item.total_revenue).toFixed(2)}</TableCell>
                    <TableCell style={{textAlign: 'right'}}>{Number(item.franchise_share).toFixed(2)}</TableCell>
                    <TableCell style={{textAlign: 'right'}}>{Number(item.wallet_balance).toFixed(2)}</TableCell>
                    <BalanceCell negative={item.current_wallet_balance < 0}>
                      {Number(item.current_wallet_balance).toFixed(2)}
                    </BalanceCell>
                    <TableCell style={{textAlign: 'center'}}>
                      <StatusBadge active={isActive}>
                        {isActive ? 'Active' : 'Closed'}
                      </StatusBadge>
                    </TableCell>
                    <TableCell style={{textAlign: 'center'}}>
                      {isActive ? (
                        <ActionButton
                          onClick={() => handleRowUpdateClick(item.franchise_id, item.month, item.year)}
                          disabled={isRowLoading}
                          small
                        >
                          {isRowLoading ? 'Closing...' : 'Month End Close'}
                        </ActionButton>
                      ) : (
                        <ActionButton disabled small>
                          Closed
                        </ActionButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <tr>
                <TableCell colSpan={hasActiveFranchise ? "10" : "9"}>
                  <EmptyState>
                    No data found for selected filters
                  </EmptyState>
                </TableCell>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default MonthEndCalculation;