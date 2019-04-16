pragma solidity >=0.4.2;

contract CarbonFootPrint{
    
    // -- Estrutura dos produtos
    struct Product{
        uint32 id;
        string name;
        string description;
        string prodUnit;
        uint32 co2eq;
        uint16 exp;
        bool intermediate;
        uint32 idOrganization;
        uint32 idUnit;
        uint32[] productFootPrints;
    }

    struct ProductFootprint{
        uint32 id;
        uint32 co2eq;
        uint16 exp;
        uint32 idProduct;
        uint32 idYear;
    }

    struct ProductQuantity{
        uint32 id;
        uint32 quantity;
        uint32 idPFootPrint;
        uint32 idM_Activity;
    }


    // -- Estrutura das organizações
    struct Organization{
        uint32 id;
        uint32 co2eq;
        uint16 exp;
        string name;
        uint32[] products;
        uint32[] m_activities;
        uint32[] m_fixcosts;
    }

    // -- Estrutura das atividades mensais
    struct MonthlyActivity{
        uint32 id;
        string description;
        uint32 co2eq;
        uint32 finalProductQt;
        uint16 exp;
        string month;
        uint32[] productQuantities; // -- codigo dos produtos de input
        uint32 output; // -- codigo do product foot print de output
        uint32 idOrganization;
        uint32 idUnit;
        uint32 idYear;
        address idUser;
    }

    // -- Estrutura dos custos fixos mensais
    struct MonthlyFixCost{
        uint32 id;
        uint32 co2eq;
        uint16 exp;
        string description;
        uint32 quantity;
        string month;
        uint32 idCostType;
        uint32 idOrganization;
        uint32 idYear;
    }

    // -- Estrutura dos custos dos produtos
    struct ProductCost{
        uint32 id;
        uint32 co2eq;
        uint16 exp;
        uint32 quantity;
        uint32 idCostType;
        uint32 idM_Activity;
    }

    // -- Estrutura do tipo de custo
    struct CostType{
        uint32 id;
        uint32 co2PerUnit;
        uint16 exp;
        string description;
        uint32 idUnit;
        uint32[] m_fixcosts;
        uint32[] products_costs;
    }

    // -- Estrutura das unidades
    struct Unit{
        uint32 id;
        string measure;
        string initials;
        uint32 base;
        uint32 exp;
        uint32 idUnit;
        bool negative;
    }

    // -- Users
    struct User{
        address user_add;
        uint16 tipo; // 0 - Admin , 1 - OrgAdmin,  2 - User
        bool status;
        uint32 idOrganization;
    }

    struct Year{
        uint32 id;
        string year;
    }


    // -- Mappings
    mapping(uint32 => Product) public products;
    uint32 public productsCount;

    mapping(uint32 => MonthlyActivity) public mactivities;
    uint32 public mactivitiesCount;

    mapping(uint32 => Organization) public organizations;
    uint32 public organizationsCount;

    mapping(uint32 => MonthlyFixCost) public mfixcosts;
    uint32 public mfixcostsCount;

    mapping(uint32 => ProductCost) public productCosts;
    uint32 public productCostsCount;

    mapping(uint32 => CostType) public costsTypes;
    uint32 public costsTypesCount;

    mapping(uint32 => Unit) public units;
    uint32 public unitsCount;

    mapping(address => User) public users;
    address[] public arrayUsers;

    mapping(uint32 => ProductFootprint) public productFootPrints;
    uint32 public pfootPrintCount;

    mapping(uint32 => ProductQuantity) public productsQuantities;
    uint32 public productsQuantitiesCount;

    mapping(uint32 => Year) public yearly;
    uint32 public yearliesCount;

    event registUserEvent (
        address indexed _candidateAddress
    );

    constructor () public{
        users[msg.sender] = User(msg.sender, 0, true, 0);
        arrayUsers.push(msg.sender);

        // -- Initalize units
        addUnit("tonne", "t", 10, 0, 1, false);
        addUnit("kilogram", "kg", 10, 3, 1, true);
        addUnit("gram", "g", 10, 6, 1, true);
        addUnit("milligram", "mg", 10, 9, 1, true);
    }

    function getUsersCount() public view returns(uint count) {
        return arrayUsers.length;
    }

    // -- GETTERS -> organization
    function getOrgProducts(uint32 _org) public view returns(uint32[] memory prods){
        return organizations[_org].products;
    }

    // -- GETTERS -> products
    function getFootPrintsProd(uint32 _prod) public view returns(uint32[] memory footprints){
        return products[_prod].productFootPrints;
    }   



    function addUser (address _userResp,address _user, uint16 _tipo, uint32 _idOrganization) public {
        
        require(users[_userResp].user_add != address(0), "User is not registred");
        require(users[_user].user_add == address(0), "User already registred");

        if(_tipo == 0 || _tipo == 1){
            require(users[_userResp].tipo == 0, "You need to have admin permissions");
        }else if(_tipo == 2){
            require(users[_userResp].tipo == 1 , "You need to have organization admin permissions");
            require(users[_userResp].idOrganization == _idOrganization, "You need to belong to the organization");
        }

        users[_user] = User(_user, _tipo, true, _idOrganization);
        arrayUsers.push(_user);

        emit registUserEvent(_user);
        
    }

    function blockUser (address _userResp, address _userBlock) public {

        require(users[_userResp].user_add != address(0), "User is not registred");
        require(users[_userResp].tipo == 0, "You need to have admin permissions");

        users[_userBlock].status = false;
    }

    function addUnit(string memory _measure, string memory _initials, uint32 _base, uint32 _exp, uint32 _idUnit,bool _negative) private{
        
        require(users[msg.sender].tipo == 0, "You need to have admin permissions");

        unitsCount++;
        Unit(unitsCount, _measure, _initials, _base, _exp, _idUnit, _negative);
        units[unitsCount] = Unit(unitsCount, _measure, _initials, _base, _exp, _idUnit, _negative);
    }

    function addOrganization(string memory _name, uint32[] memory _products, uint32[] memory _m_activities, uint32[] memory _m_fixcosts) public {
        require(users[msg.sender].tipo == 0, "You need to have admin permissions");

        organizationsCount++;
        organizations[organizationsCount] = Organization(organizationsCount, 0, 0, _name, _products, _m_activities, _m_fixcosts); 
    }

    function addProduct(string memory _name, string memory _description, 
        bool _intermediate, uint32 _org, uint32 _unit, uint32[] memory _footPrints) public{
        
        //require(users[msg.sender].idOrganization == _org, "You need to belong to the organization");

        productsCount++;
        products[productsCount] = Product(productsCount, _name, _description, units[_unit].initials, 0, 0,
            _intermediate, _org, _unit, _footPrints);
        organizations[_org].products.push(productsCount);

    }

    function addYear(string memory _year) public {
        require(users[msg.sender].tipo == 0, "You need to have admin permissions");        
        yearliesCount++;
        yearly[yearliesCount] = Year(yearliesCount, _year);
    }

    function addFootPrintProd(uint32 _co2eq, uint16 _exp, uint32 _idProd, uint32 _idYear) public {
        
        //require(users[msg.sender].idOrganization == products[_idProd].idOrganization, "The product doesnt belong to your organization");        

        pfootPrintCount++;
        productFootPrints[pfootPrintCount] = ProductFootprint(pfootPrintCount, _co2eq, _exp, _idProd, _idYear);
        products[_idProd].productFootPrints.push(pfootPrintCount);
    }

    function updateCO2Prod(uint32 _id, uint32 _co2eq, uint16 _exp) public {
        products[_id].co2eq = _co2eq;
        products[_id].exp = _exp;
    }

    function addCostType(uint32 _co2, uint16 _exp, string memory _desc, uint32 _idUnit, 
        uint32[] memory _fixCosts, uint32[] memory _p_costs) public {

        //require(users[msg.sender].tipo == 0 || users[msg.sender].tipo == 1, "You need to have admin/org admin permissions");        
        

        costsTypesCount++;
        costsTypes[costsTypesCount] = CostType(costsTypesCount, _co2, _exp, _desc, _idUnit, _fixCosts, _p_costs);
    }

    function addMonthlyFixCost(uint32 _co2eq, uint16 _exp, string memory _desc, uint32 _qtd, 
        string memory _month,uint32 _idCost,uint32 _idOrg, uint32 _idYear) public{

        //require(users[msg.sender].idOrganization == _idOrg, "You need to belong to the organization");        

        mfixcostsCount++;
        mfixcosts[mfixcostsCount] = MonthlyFixCost(mfixcostsCount, _co2eq, _exp, _desc, _qtd, _month, _idCost, _idOrg, _idYear);
        costsTypes[_idCost].m_fixcosts.push(mfixcostsCount);
        organizations[_idOrg].m_fixcosts.push(mfixcostsCount);
    }

    function addMonthlyActivity(string memory _desc, uint32 _co2eq, uint32 _qtd, uint16 _exp, string memory _month,
        uint32[] memory _prodQuantities, uint32 _output, uint32 _idOrg, uint32 _idUnit, uint32 _idYear) public{
        
        //require(users[msg.sender].idOrganization == _idOrg, "You need to belong to the organization");    

        mactivitiesCount++;
        mactivities[mactivitiesCount] = MonthlyActivity(mactivitiesCount, _desc, _co2eq, _qtd, _exp, _month, _prodQuantities, _output, _idOrg, _idUnit, _idYear, msg.sender);
        organizations[_idOrg].m_fixcosts.push(mactivitiesCount);
    }


    function addProdQuantity(uint32 _qtd, uint32 _idPfootPrint, uint32 _m_activity) public{
        productsQuantitiesCount++;
        productsQuantities[productsQuantitiesCount] = ProductQuantity(productsQuantitiesCount, _qtd, _idPfootPrint, _m_activity);
    }

    function updateMonthlyActivity(uint32 _idProd, uint32 _idMA) public {
        mactivities[_idMA].productQuantities.push(_idProd);
    }



}