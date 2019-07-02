pragma solidity >=0.4.2;

contract CarbonFootPrint {

// -- Structures Implementation --

// ----------------------------- PRODUCT STRUCTURES -----------------------------

// -- General Product Structure --
    struct Product{
        uint32 id;
        string name;
        string description;
        string prodUnit;
        bool intermediate;
        uint32 idOrganization;
        uint32 idUnit;
        uint32[] productFootPrints;
    }
    
// -- Specific Product Footprint - Result of Monthly Activity --
    struct ProductFootprint{
        uint32 id;
        uint32 co2eq;
        uint16 exp;
        uint32 idProduct;
        uint32 year;
        string month;
        uint32 idMA;
    }
 
// -- Products Used in Monthly Activity Quantity --
    struct ProductQuantity{
        uint32 id;
        uint32 quantity;
        uint32 idPFootPrint;
        uint32 idM_Activity;
    }


// -- Organizations Structure -- 
    struct Organization{
        uint32 id;
        uint32 co2eq;
        uint16 exp;
        string name;
        string description;
        string businessArea;
        string email;
        uint32[] products;
        uint32[] m_activities;
        uint32[] m_fixcosts;
    }

// -- Monthly Activities Structure -- 
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
        uint32 year;
        address idUser;
    }

// -- Monthly Fixed Costs Structure
    struct MonthlyFixCost{
        uint32 id;
        uint32 co2eq;
        uint16 exp;
        string description;
        uint32 quantity;
        string month;
        uint32 idCostType;
        uint32 idOrganization;
        uint32 year;
    }

// -- Product Cost Structure
    struct ProductCost{
        uint32 id;
        uint32 co2eq;
        uint16 exp;
        uint32 quantity;
        uint32 idCostType;
        uint32 idM_Activity;
    }

// -- Cost Type Structure --
    struct CostType{
        uint32 id;
        uint32 co2PerUnit;
        uint16 exp;
        string description;
        uint32 idUnit;
        uint32[] m_fixcosts;
        uint32[] products_costs;
    }

// -- Unit Structure --    
    struct Unit{
        uint32 id;
        string measure;
        string initials;
        uint32 base;
        uint32 exp;
        uint32 idUnit;
        bool negative;
    }

// -- Users Structure --
    struct User{
        address user_add;
        uint16 tipo; // 0 - Admin , 1 - OrgAdmin,  2 - User
        bool status;
    }
    
// -- Request Structure --
    struct Request{
        uint32 id;
        address user;
        bool accepted;
        string org_name;
        string org_desc;
        string org_barea;
        string org_email;
    }


// ----------------------------- MAPPINGS REQUIRED TO ACCESS RESPECTIVE STRUCT INFORMATION -----------------------------
// ----------------------------- AND COUNTERS FOR TOTAL NUMBER OF ELEMENTS -----------------------------
    
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
    mapping(address => uint32[]) public userOrganizations;
    
    address[] public arrayUsers;

    mapping(uint32 => ProductFootprint) public productFootPrints;
    uint32 public pfootPrintCount;

    mapping(uint32 => ProductQuantity) public productsQuantities;
    uint32 public productsQuantitiesCount;
    
    mapping(uint32 => Request) public requests;
    uint32 public requestsCount;

    uint32[] public arrayYears;

    event registUserEvent (
        address indexed _candidateAddress
    );


// ----------------------------- CONSTRUCTOR AND DEFAULT VALUES SETTING -----------------------------

    constructor () public{
        
        users[msg.sender] = User(msg.sender, 0, true);
        arrayUsers.push(msg.sender);

        // -- Initalize units
        addUnit("tonne", "t", 10, 0, 1, false);
        addUnit("kilogram", "kg", 10, 3, 1, true);
        addUnit("gram", "g", 10, 6, 1, true);
        addUnit("milligram", "mg", 10, 9, 1, true);
        
        addUnit("megaliter", "Ml", 10, 0, 5, false);
        addUnit("kilolitre", "kl", 10, 3, 5, true);
        addUnit("hectolitre", "hl", 10, 4, 5, true);
        addUnit("decalitre", "dl", 10, 5, 5, true);
        addUnit("litre", "l", 10, 6, 5, true);
        
        addUnit("kilometre", "km", 10, 0, 10, false);
        addUnit("metre", "m", 10, 3, 10, true);
        addUnit("centimetre", "cm", 10, 5, 10, true);
        
        addUnit("kilowatt houre", "kw/h", 10, 0, 13, false);
        addUnit("watt houre", "w/h", 10, 3, 13, true);
        
        addUnit("unit", "unit", 10, 0, 15, false);
        
        
        addYear(2019);
    }
    
//  ----------------------------- GETTERS -----------------------------

    function getYearsCount() public view returns(uint count){
        return arrayYears.length;
    }

    function getUsersCount() public view returns(uint count) {
        return arrayUsers.length;
    }
    
// -- Get 
    function getUserOrganizations(address _add) public view returns(uint32[] memory orgs){
        return userOrganizations[_add];
    }

// -- Get All Products From Organization --
    function getOrgProducts(uint32 _org) public view returns(uint32[] memory prods){
        return organizations[_org].products;
    }
    
//-- Get Organizations Monthly Activities --
    function getOrgMactivities(uint32 _org) public view returns(uint32[] memory m_activities){
        return organizations[_org].m_activities;
    }
    
//Get Organization's Fixed Costs
    function getOrgFixCosts(uint32 _org) public view returns(uint32[] memory m_fixcosts){
        return organizations[_org].m_fixcosts;
    }
    
// -- 
    function getProdQuantities(uint32 _prod) public view returns(uint32[] memory quantities){
        return mactiviies[_prod].productQuantities;
    }

// -- Get All Footprints For a Specific Product --
    
    function getFootPrintsProd(uint32 _prod) public view returns(uint32[] memory footprints){
        return products[_prod].productFootPrints;
    }   

// ----------------------------- ADDITIONAL FUNCTIONS -----------------------------

// -- Verification if Address (User) Exists --
    function isNull(address _add) public pure returns(bool addressNull){
        return _add == address(0);
    }
    
// -- Add New User Function --
    function addUser (address _userResp,address _user, uint16 _tipo, uint32 _organization) public {
        
        require(users[_user].user_add == address(0), "User already registred");

        if(_tipo == 0 || _tipo == 1){
            require(users[_userResp].tipo == 0, "You need to have admin permissions");
        }else if(_tipo == 2){
            require(users[_userResp].tipo == 1 , "You need to have organization admin permissions");
        }

        users[_user] = User(_user, _tipo, true);
        arrayUsers.push(_user);
        userOrganizations[_user].push(_organization);

        emit registUserEvent(_user);
        
    }

    function blockUser (address _userResp, address _userBlock) public {

        require(users[_userResp].tipo == 0, "You need to have admin permissions");

        users[_userBlock].status = false;
    }
    
    function unblockUser(address _userResp, address _userBlock) public {
        
        require(users[_userResp].tipo == 0, "You need to have admin permissions");
        
        users[_userBlock].status = true;
    }
    
// -- Add New Measure Unit Function --
    function addUnit(string memory _measure, string memory _initials, uint32 _base, uint32 _exp, uint32 _idUnit,bool _negative) public{
        
        require(users[msg.sender].tipo == 0, "You need to have admin permissions");

        unitsCount++;
        Unit(unitsCount, _measure, _initials, _base, _exp, _idUnit, _negative);
        units[unitsCount] = Unit(unitsCount, _measure, _initials, _base, _exp, _idUnit, _negative);
    }

// -- Add New Organization Function --
    function addOrganization(string memory _name, string memory _description, 
    string memory _businessArea, string memory _email, address _user, 
    uint32[] memory _products, uint32[] memory _m_activities, uint32[] memory _m_fixcosts) public {
        
        require(users[msg.sender].tipo == 0, "You need to have admin permissions");
        bool exist = false;

        for(uint32 i=1; i <= organizationsCount; i++){
            string memory name = organizations[i].name;
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(_name))){
                exist = true;
            }
        }

        require(!exist, "Organization already registred");
        
        for(uint32 i=1; i <= requestsCount; i++){
            string memory name = requests[i].org_name;
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(_name))){
                requests[i].accepted = true;
            }
        }

        organizationsCount++;
        organizations[organizationsCount] = Organization(organizationsCount, 0, 0, _name, _description, _businessArea, _email, _products, _m_activities, _m_fixcosts); 
        
        
        if(users[_user].user_add == address(0)){
            addUser(msg.sender, _user, 1, organizationsCount);    
        }else{
            userOrganizations[_user].push(organizationsCount);
        }
        
    }

// -- Add New Product Function --
    function addProduct(string memory _name, string memory _description, 
        bool _intermediate, uint32 _org, uint32 _unit, uint32[] memory _footPrints) public{
        
        bool exist = false;        
        //require(users[msg.sender].idOrganization == _org, "You need to belong to the organization");
        require(organizations[_org].id != uint32(0), "Organization doesn't exist");

        for(uint32 i=1; i <= organizationsCount; i++){
            string memory name = products[i].name;
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(_name))){
                exist = true;
            }
        }

        require(!exist, "Product already registred");


        productsCount++;
        products[productsCount] = Product(productsCount, _name, _description, units[_unit].initials,
            _intermediate, _org, _unit, _footPrints);
        organizations[_org].products.push(productsCount);

    }

    function addYear(uint32 _year) public {
        require(users[msg.sender].tipo == 0, "You need to have admin permissions");
        require(!existsYear(_year), "Year already registred");
        
        arrayYears.push(_year);
    }
    
// -- Add New Organization Signup Request Function --
    function addRequest(address _user, string memory _orgName, string memory _orgDesc, 
    string memory _orgBarea, string memory _orgEmail) public {
        
        bool exist = false;
        
        for(uint32 i=1; i <= requestsCount; i++){
            if(requests[i].user == _user && !requests[i].accepted){
                exist = true;
            }
        }
        
        require(!exist, "Same user can't create more than 1 request");
        
        requestsCount ++;
        requests[requestsCount] = Request(requestsCount, _user, false, _orgName, _orgDesc, _orgBarea, _orgEmail);
    }

// -- Reject Signup Request Function --
    function rejectRequest(string memory _name) public {
        
        for(uint32 i=1; i <= requestsCount; i++){
            string memory name = requests[i].org_name;
            if(keccak256(abi.encodePacked(name)) == keccak256(abi.encodePacked(_name))){
                requests[i].accepted = true;
            }
        }
    }
    
// -- Year Exists Verification Function --
    function existsYear(uint32 _year) public view returns (bool exists){
        bool exist = false;
        
        for(uint i=0; i < arrayYears.length; i++){
            if(arrayYears[i] == _year){
                return true;
            }
        }
        
        return exist;
    }

// -- Add New Product Footprint Function --
    function addFootPrintProd(uint32 _co2eq, uint16 _exp, uint32 _idProd, uint32 _year, string memory _month, uint32 _idMa) public {
        
        //require(users[msg.sender].idOrganization == products[_idProd].idOrganization, "The product doesnt belong to your organization");        
        require(products[_idProd].id != uint32(0), "Product doesn't exist");


        
        pfootPrintCount++;
        productFootPrints[pfootPrintCount] = ProductFootprint(pfootPrintCount, _co2eq, _exp, _idProd, _year, _month, _idMa);
        products[_idProd].productFootPrints.push(pfootPrintCount);
    }

    function addCostType(uint32 _co2, uint16 _exp, string memory _desc, uint32 _idUnit, 
        uint32[] memory _fixCosts, uint32[] memory _p_costs) public {

        //require(users[msg.sender].tipo == 0 || users[msg.sender].tipo == 1, "You need to have admin/org admin permissions");        
        

        costsTypesCount++;
        costsTypes[costsTypesCount] = CostType(costsTypesCount, _co2, _exp, _desc, _idUnit, _fixCosts, _p_costs);
    }

// -- Add Organization New Monthly Fixed Costs Function --
    function addMonthlyFixCost(uint32 _co2eq, uint16 _exp, string memory _desc, uint32 _qtd, 
        string memory _month,uint32 _idCost,uint32 _idOrg, uint32 _year) public{

        //require(users[msg.sender].idOrganization == _idOrg, "You need to belong to the organization");        

        mfixcostsCount++;
        mfixcosts[mfixcostsCount] = MonthlyFixCost(mfixcostsCount, _co2eq, _exp, _desc, _qtd, _month, _idCost, _idOrg, _year);
        costsTypes[_idCost].m_fixcosts.push(mfixcostsCount);
        organizations[_idOrg].m_fixcosts.push(mfixcostsCount);
    }

// -- Add Organization's New Monthly Activity Function --
    function addMonthlyActivity(string memory _desc, uint32 _qtd, string memory _month,
        uint32[] memory _prodQuantities, uint32 _output, uint32 _idOrg, uint32 _idUnit, uint32 _year, uint32 _co2eq, uint16 _exp ) public{
        
        //require(users[msg.sender].idOrganization == _idOrg, "You need to belong to the organization");    

        mactivitiesCount++;
        mactivities[mactivitiesCount] = MonthlyActivity(mactivitiesCount, _desc, _co2eq, _qtd, _exp, _month, _prodQuantities, _output, _idOrg, _idUnit, _year, msg.sender);
        organizations[_idOrg].m_activities.push(mactivitiesCount);
    }
    
    
    function addProductionCost(uint32 _co2, uint16 _exp, uint32 _qt, uint32 _costType, uint32 _mactivity) public {
        productCostsCount++;
        productCosts[productCostsCount] = ProductCost(productCostsCount, _co2, _exp, _qt, _costType, _mactivity);
    }


    function addProdQuantity(uint32 _qtd, uint32 _idPfootPrint, uint32 _m_activity) public{
        productsQuantitiesCount++;
        productsQuantities[productsQuantitiesCount] = ProductQuantity(productsQuantitiesCount, _qtd, _idPfootPrint, _m_activity);
        mactivities[_m_activity].productQuantities.push(productsQuantitiesCount);
    }

    function updateCO2org(uint32 _org, uint32 _co2eq, uint16 _exp) public {
        organizations[_org].co2eq = _co2eq;
        organizations[_org].exp = _exp;
    }
    
    function updateCO2mactivity(uint32 _mactivity, uint32 _co2eq, uint16 _exp) public {
        mactivities[_mactivity].co2eq = _co2eq;
        mactivities[_mactivity].exp = _exp;
    }
    
    function updateCO2pfootprint(uint32 _pfootprint, uint32 _co2eq, uint16 _exp) public {
        productFootPrints[_pfootprint].co2eq = _co2eq;
        productFootPrints[_pfootprint].exp = _exp;
    }

    function verifyUser(address _user) public view returns(string memory message){
        
        if(users[_user].user_add == address(0)){
            return "not_registred";
        }else if(users[_user].status == false){
            return "blocked";
        }else {
            return "ok";
        }
        
    }
}
