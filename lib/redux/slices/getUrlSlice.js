import { createSlice } from "@reduxjs/toolkit";
import { getConfig } from "@/lib/config";

const initialState = {
  baseUrl: "",
  imgUploadUrl: "",
  imageUrl: "",
  attachmentUrl: "",
  fileUploadUrl: "",
  pdfurl: "",
  ProdCardIssue: "",
  opngStck: "",
  batchMatUrl: "",
  batchDamage: "",
  batchDamageMaterialUrl: "",
  assortedUrl: "",
  apiUrl: "",
  indentorederUrl: "",
  assortedorederUrl: "",
  listViewurl: "",
  summaryUrl: "",
  loginUrl: "",
  authUrl: "",
  comboUrl: "",
  imageNameUpdateUrl: "",
  pcdurl: "",
  indentUrl: "",
  invoiceUrl: "",
  commonUrl: "",
  additionalUrl: "",
  bomCopyUrl: "",
  bomHeaderUrl: "",
  stockUrl: "",
  finalinvUrl: "",
  proformainvUrl: "",
  orderUrl: "",
  stockReqUrl: "",
  productUrl: "",
  bomLkUrl: "",
  designPUrl: "",
  costingMatrialUrl: "",
  conversionUrl: "",
  userGroupUrl: "",
  dcTrackingUrl: "",
  trackingUrl: "",
  supplierTrackUrl: "",
  materialsTrackingUrl: "",
  supplytrackingUrl: "",
  producttrackingUrl: "",
  customerorderanalysisUrl: "",
  prductorderanalysisUrl: "",
  mailContentGeturl: "",
  mailSendUrl: "",
  materialUomCovUrl: "",
  decryptUrl: "",
  costingLeatherUrl: "",
  customerLeatherUrl: "",
  getempdeploymentUrl: "",
  postempdeployment: "",
  matProcurementUrl: "",
  stockorderUrl: "",
  dcsummaryUrl: "",
  dcpostsummaryUrl: "",
  packinglistCbmUrl: "",
  searchUrl: "",
  bomCopyJobworkUrl: "",
  jobworkbomurl: "",
  alterNateMaterial: "",
  PurchaseOrderParameterUrl: "",
  PurchaseorderratingUrl: "",
  CustomerPriceorderQtyUrl: "",
  invoiceCustomsUrl: "",
  salesinvoiceUrl: "",
  productsalesUrl: "",
  customerproductUrl: "",
  productioncardconsumptionUrl: "",
  ProductioncardrequirementUrl: "",
  internalorderUrl: "",
  invoiceprocessUrl: "",
  prdCardBthUrl: "",
  InvoiceUrl: "",
  InvoiceProductProfitUrl: "",
  ProformaInvoiceUrl: "",
  DChallanUrl: "",
  ProductpackingUrl: "",
  LeatherPackingUrl: "",
  IndentlLeatherurl: "",
  IndentMaterialUrl: "",
  CustproductsUrl: "",
  SalesleatherListUrl: "",
  DomesticInvoiceurl: "",
  ProductexportSampleInvoiceurl: "",
  Dchallanouturl: "",
  AssortedupdateUrl: "",
  Salesreporturl: "",
  logreporturl: "",
  assortedInvHeaderUrl: "",
  changePasswordurl: "",
  materialstockurl: "",
  materialmaster: "",
  bomcostingUrl: "",
  openpurchaseorderMaterialurl: "",
  openpurchaseorderleatherurl: "",
  customerpaymenturl: "",
  additionalorderurl: "",
  invoceChartDetailurl: "",
  paymentChartDetailurl: "",
  prdCardIssueStatusUrl: "",
  finalInvoiceProcessUrl: "",
  productPackingProcessUrl: "",
  productionCardDeleteUrl: "",
  InternalOrderUrl: "",
  InternalOrderEstimatedUrl: "",
  CustomerOrderUrl: "",
  prodCustomerOrderUrl: "",
  StockArrangementGet: "",
  StockArrangementPost: "",
  StockArrangementBulkPost: "",
  OpeningStockArrangementGet: "",
  ProductioncardRequirementReportGet: "",
  ProductioncardConsumptionReportGet: "",
  PriceListControllerGet: "",
  batchUrl: "",
  itemsUrl: "",
  cartUrl: "",
};

export const getUrlSlice = createSlice({
  name: "globalurl",
  initialState,
  reducers: {
    initGlobalUrl: (state) => {
      const config = getConfig();

      const apiurl = config.API_URL || "https://crateapi.bexlgems.com/api/";
      const baseurl = config.BASE_URL || "https://crateapi.bexlgems.com/";

      state.baseUrl = baseurl;

      state.imgUploadUrl = baseurl + "imgup.php";
      state.imageUrl = baseurl + "uploads/images/";
      state.attachmentUrl = baseurl + "uploads/attachments/";
      state.fileUploadUrl = baseurl + "fileupload.php";
      state.pdfurl = baseurl + "tcpdf/";
      state.ProdCardIssue = apiurl + "ProductionRequestGetController.php";
      state.opngStck = apiurl + "OpenStockFinyearController.php";
      state.batchMatUrl = apiurl + "GeneralConsumptionMaterialController.php";
      state.batchDamage = apiurl + "BatchDamageController.php";
      state.batchDamageMaterialUrl = apiurl + "MaterialBatchDamage.php";
      state.assortedUrl = apiurl + "ProductPackingGetController.php";
      state.apiUrl = apiurl + "APIController.php";
      state.indentorederUrl = apiurl + "Leatherindentcontroller.php";
      state.assortedorederUrl = apiurl + "Productpackingupdatecontroller.php";
      state.listViewurl = apiurl + "wslistview_mysql.php";
      state.summaryUrl = apiurl + "Pricelistsummarycontroller.php";
      state.loginUrl = apiurl + "LController.php";
      state.authUrl = apiurl + "auth.php";
      state.comboUrl = apiurl + "APIController.php";
      state.imageNameUpdateUrl = apiurl + "CMController.php";
      state.pcdurl = apiurl + "PCDController.php";
      state.indentUrl = apiurl + "IndentController.php";
      state.invoiceUrl = apiurl + "InvoiceController.php";
      state.commonUrl = apiurl + "CommonController.php";
      state.bomCopyUrl = apiurl + "VersioningController.php";
      state.bomHeaderUrl = apiurl + "BOMController.php";
      state.stockUrl = apiurl + "StockController.php";
      state.batchUrl = apiurl + "BatchstructureController.php";
      state.finalinvUrl = apiurl + "FinalInvoiceController.php";
      state.proformainvUrl = apiurl + "ProfoinvoiceController.php";
      state.orderUrl = apiurl + "CustomerOrder.php";
      state.stockReqUrl = apiurl + "StockRequirement.php";
      state.productUrl = apiurl + "StockProcedure.php";
      state.bomLkUrl = apiurl + "BOMLeatherCountController.php";
      state.designPUrl = apiurl + "UomconversiongetController.php";
      state.costingMatrialUrl = apiurl + "BomcostController.php?";
      state.conversionUrl = apiurl + "UomconversiongetController.php";
      state.userGroupUrl = apiurl + "GroupaccessController.php";
      state.dcTrackingUrl = apiurl + "DctrackingController.php";
      state.trackingUrl = apiurl + "MaterialtrackingController.php";
      state.supplierTrackUrl = apiurl + "SuppliertrackingController.php";
      state.materialsTrackingUrl = apiurl + "MaterialTrackingChart.php";
      state.supplytrackingUrl = apiurl + "SupplierTrackingChart.php";
      state.producttrackingUrl = apiurl + "ProductpriceController.php?";
      state.customerorderanalysisUrl = apiurl + "CustomerOrderChart.php?";
      state.prductorderanalysisUrl = apiurl + "ProductOrderChart.php?";
      state.mailContentGeturl = apiurl + "EmailController.php";
      state.mailSendUrl = apiurl + "invoicemail.php";
      state.materialUomCovUrl = apiurl + "MaterialUOMConversionController.php";
      state.decryptUrl = apiurl + "HashtokenController.php";
      state.costingLeatherUrl = apiurl + "BomLeathercost.php";
      state.customerLeatherUrl = apiurl + "CustomerLeatherController.php";
      state.getempdeploymentUrl = apiurl + "getempdeployment.php?";
      state.postempdeployment = apiurl + "postempdeployment.php?";
      state.matProcurementUrl = apiurl + "MaterialProcurementChart.php";
      state.stockorderUrl = apiurl + "MaterialOrderReportController.php";
      state.dcsummaryUrl = apiurl + "getdcsummary.php";
      state.dcpostsummaryUrl = apiurl + "postdcsummary.php";
      state.packinglistCbmUrl = apiurl + "CbmCalculation.php";
      state.searchUrl = apiurl + "productSearch.php";
      state.bomCopyJobworkUrl = apiurl + "JobworkversionController.php";
      state.jobworkbomurl = apiurl + "JobworkController.php";
      state.alterNateMaterial = apiurl + "AlterMaterialController.php";
      state.PurchaseOrderParameterUrl = apiurl + "APIController.php";
      state.PurchaseorderratingUrl = apiurl + "ParametergetController.php";
      state.CustomerPriceorderQtyUrl = apiurl + "InternalorderController.php";
      state.invoiceCustomsUrl = apiurl + "InvoiceCustomController.php";
      state.salesinvoiceUrl = apiurl + "Invoicewisesalesreport.php";
      state.productsalesUrl = apiurl + "FiProductcategoryController.php";
      state.customerproductUrl = apiurl + "CustomerbasedFinalInvoicewiseproductreport.php";
      state.productioncardconsumptionUrl = apiurl + "ProductioncardConsumptionReport.php";
      state.ProductioncardrequirementUrl = apiurl + "ProductioncardRequirementReport.php";
      state.internalorderUrl = apiurl + "ProductInternalorder.php";
      state.invoiceprocessUrl = apiurl + "Invoiceprocesscontroller.php";
      state.prdCardBthUrl = apiurl + "PrdBatchIssueController.php";
      state.InvoiceUrl = apiurl + "InvoiceReportController.php";
      state.InvoiceProductProfitUrl = apiurl + "MatlPriceVarianceProfitandLossReport.php";
      state.ProformaInvoiceUrl = apiurl + "InvoiceReportController.php";
      state.DChallanUrl = apiurl + "DelevieryChallanController.php";
      state.ProductpackingUrl = apiurl + "ProductpackinglistController.php";
      state.LeatherPackingUrl = apiurl + "PackingListReportController.php";
      state.IndentlLeatherurl = apiurl + "PurchaseOrderController.php";
      state.IndentMaterialUrl = apiurl + "PurchasematerialController.php";
      state.CustproductsUrl = apiurl + "Customerbasedproductprice.php";
      state.SalesleatherListUrl = apiurl + "SalesleatherpricelistController.php";
      state.DomesticInvoiceurl = apiurl + "DomesticInvoiceController.php";
      state.ProductexportSampleInvoiceurl = apiurl + "InvoiceReportController.php";
      state.Dchallanouturl = apiurl + "DelevieryChallanController.php";
      state.AssortedupdateUrl = apiurl + "Productpackingupdatecontroller.php";
      state.Salesreporturl = apiurl + "SalesReportController.php";
      state.logreporturl = apiurl + "LogProcessController.php";
      state.assortedInvHeaderUrl = apiurl + "InvoiceHeaderPackingController.php";
      state.changePasswordurl = apiurl + "ChangePasswordController.php";
      state.materialstockurl = apiurl + "MaterialCategoryController.php";
      state.materialmaster = apiurl + "StockEnquiryController.php";
      state.bomcostingUrl = apiurl + "BOMCostingController.php";
      state.openpurchaseorderMaterialurl = apiurl + "OpenPurchaseOrderMaterialController.php";
      state.openpurchaseorderleatherurl = apiurl + "OpenPurchaseOrderLeatherController.php";
      state.customerpaymenturl = apiurl + "CustPytPendReportController.php";
      state.additionalorderurl = apiurl + "InvoiceVersioningController.php";
      state.invoceChartDetailurl = apiurl + "OrderAttachment.php";
      state.paymentChartDetailurl = apiurl + "PaymentPendingStatus.php";
      state.prdCardIssueStatusUrl = apiurl + "ProductionIssueIconController.php";
      state.finalInvoiceProcessUrl = apiurl + "FinalInvoiceProcessController.php";
      state.productPackingProcessUrl = apiurl + "PackingProcessController.php";
      state.productionCardDeleteUrl = apiurl + "ProductioncardDeleteController.php";
      state.InternalOrderUrl = apiurl + "IOController.php";
      state.InternalOrderEstimatedUrl = apiurl + "EstimatedIoController.php";
      state.CustomerOrderUrl = apiurl + "CustomerIoController.php";
      state.prodCustomerOrderUrl = apiurl + "CustomerIoController.php";
      state.StockArrangementGet = apiurl + "StockArrangementGetController.php";
      state.StockArrangementPost = apiurl + "StockArrangementPostController.php";
      state.StockArrangementBulkPost = apiurl + "StockBulkUpdateController.php";
      state.OpeningStockArrangementGet = apiurl + "StockArrangementDateGetController.php";
      state.ProductioncardRequirementReportGet = apiurl + "ProductioncardRequirementReport.php";
      state.ProductioncardConsumptionReportGet = apiurl + "ProductioncardConsumptionReport.php";
      state.PriceListControllerGet = apiurl + "PriceListController.php";
      state.itemsUrl = apiurl + "items";
      state.cartUrl = config.CART_API_URL || process.env.NEXT_PUBLIC_CART_API_URL || "https://crateapi.bexlgems.com/api/cart";
    },
  },
});

export const { initGlobalUrl } = getUrlSlice.actions;
export default getUrlSlice.reducer;
