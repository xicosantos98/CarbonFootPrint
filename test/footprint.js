var CarbonFootPrint = artifacts.require("./CarbonFootPrint.sol");

contract("CarbonFootPrint", function (accounts) {
    let cfootprintInstance, super_admin = accounts[0], users_count;


    beforeEach('setup contract for each test', async function () {
        cfootprintInstance = await CarbonFootPrint.new();
        users_count = await cfootprintInstance.getUsersCount();        
    })

    it("initializes with 1 admin", async function () {
        assert.equal(await cfootprintInstance.getUsersCount(), 1);
    });

    it("allows admin to regist new admin", async function () {
        var new_admin = accounts[1]       
        await cfootprintInstance.addUser(super_admin, new_admin, 0, 0);
        var expectedValue = await cfootprintInstance.getUsersCount();                
        assert.equal(expectedValue.toNumber(), (users_count.toNumber() + 1));
    })

    it("throws an exception for invalid admin registration", async function () {

        try {
            await cfootprintInstance.addUser(accounts[0], accounts[1], 1, 0)

            await cfootprintInstance.addUser(accounts[1], accounts[2], 2, 1)
        
        } catch (error) {
            var not_registred = error.message.search('User is not registred') >= 0
            var already_registred = error.message.search('User already registred') >= 0
            var admin_permission = error.message.search('You need to have admin permissions') >= 0
            var org_admin_permission = error.message.search('You need to have organization admin permissions') >= 0
            var belong_org = error.message.search('You need to belong to the organization') >= 0

            assert(not_registred || already_registred || admin_permission || org_admin_permission || belong_org, "Error message: " + error);
            console.log(error.message);

            return;
        }

        assert.fail("Error throw not received");
    })


    it("initializes with all units", async function () {
        assert.equal(await cfootprintInstance.unitsCount(), 4);
    })

    it("allows to create new organization", async function() {
        var nome = "Lidia e Costa";
        await cfootprintInstance.addOrganization(nome, [], [], []);
        var organization = await cfootprintInstance.organizations(1);
        assert.equal(nome, organization.name);
    })

    it("allows to create new product", async function(){
        await cfootprintInstance.addProduct("Tecido", "10 kg de tecido", true, 0, 2, []);
        assert.equal(1, await cfootprintInstance.productsCount());
    })

    it("allows to create new year", async function(){
        await cfootprintInstance.addYear("2019");
        assert.equal(1, await cfootprintInstance.yearliesCount());
    })

    it("allows to create new product footprint", async function(){
        await cfootprintInstance.addProduct("Tecido", "10 kg de tecido", true, 0, 2, []);
        await cfootprintInstance.addFootPrintProd(324, 3, 1, 0);
        assert.equal(1, await cfootprintInstance.pfootPrintCount());
    })
    
    it("allows to create new cost type", async function(){
        await cfootprintInstance.addCostType(353, 2, "Gas flared", 2, [], []);
        assert.equal(1, await cfootprintInstance.costsTypesCount());
    })
    
    it("allows to create new monthly fix cost", async function(){
        await cfootprintInstance.addMonthlyFixCost(353, 2, "Electricity", 5000, "April", 0, 0 , 0);
        assert.equal(1, await cfootprintInstance.mfixcostsCount());
    })

    it("allows to create new monthly activity", async function(){
        await cfootprintInstance.addMonthlyActivity("packing", 353, 5000, 3, "April", [], 0, 0, 2, 1);
        assert.equal(1, await cfootprintInstance.mactivitiesCount());
    })

    it("allows to create new product quantity", async function(){
        await cfootprintInstance.addProdQuantity(100, 0, 0);
        assert.equal(1, await cfootprintInstance.productsQuantitiesCount());
    })







})