import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { EmptyState } from "../../components";
import {
  useGetCepBasketQuery,
  useGetStocksQuery,
  useCreateCepBasketMutation,
  useAddStockToBasketMutation,
  useRemoveStockFromBasketMutation,
  useUpdateCepBasketMutation,
  useBulkUpdateCepBasketsMutation,
} from "../../redux/slices/cepbasket/cepbasketApi";
import {
  Header,
  CepCreateBasketForm,
  CepStockAdder,
  CepStockTable,
  BasketPickerModal,
  StatusModal,
} from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

const CepBasketPage = () => {
  const { currentMode } = useStateContext();
  const containerBg =
    currentMode === "Dark"
      ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border-2 border-gray-700"
      : "bg-white shadow-lg";
  const isDark = currentMode === "Dark";
  // container e.g. isDark not needed beyond container class

  const {
    data: basketsRes,
    isLoading: isLoadingBaskets,
    error: basketsError,
  } = useGetCepBasketQuery();
  const {
    data: stocksRes,
    isLoading: isLoadingStocks,
    error: stocksError,
  } = useGetStocksQuery();

  const [createCepBasket, { isLoading: isCreating }] =
    useCreateCepBasketMutation();
  const [addStockToBasket, { isLoading: isAdding }] =
    useAddStockToBasketMutation();
  const [removeStockFromBasket, { isLoading: isRemoving }] =
    useRemoveStockFromBasketMutation();
  const [updateCepBasket, { isLoading: isUpdating }] =
    useUpdateCepBasketMutation();
  const [bulkUpdateCepBaskets, { isLoading: isBulkUpdating }] =
    useBulkUpdateCepBasketsMutation();

  const baskets = useMemo(
    () => basketsRes?.data ?? basketsRes ?? [],
    [basketsRes]
  );
  const stocks = useMemo(() => stocksRes?.data ?? stocksRes ?? [], [stocksRes]);

  const [selectedBasketId, setSelectedBasketId] = useState("");
  const selectedBasketServer = useMemo(
    () => baskets.find((b) => String(b.id) === String(selectedBasketId)),
    [baskets, selectedBasketId]
  );

  const [selectedBasket, setSelectedBasket] = useState(null);
  useEffect(() => {
    if (selectedBasketServer) {
      setSelectedBasket(JSON.parse(JSON.stringify(selectedBasketServer)));
    }
  }, [selectedBasketServer]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExchange, setSelectedExchange] = useState("");
  const [newStockId, setNewStockId] = useState("");
  const [volumeInput, setVolumeInput] = useState("");
  const [marketCap, setMarketCap] = useState(0);
  const [marketcapWeight, setMarketcapWeight] = useState(0);
  const [basketWeight, setBasketWeight] = useState(0);
  const [file, setFile] = useState(null);

  const [newBasket, setNewBasket] = useState({
    cep_name: "",
    methodologies: "",
    description: "",
    image_url: "",
    graph_lock_period: "",
    is_conservative: false,
    is_balanced: false,
    is_growth: false,
    is_aggressive: false,
    is_active: false,
  });

  // UI state hooks must be declared before any early returns
  const [pickerOpen, setPickerOpen] = useState(false);
  const [statusModal, setStatusModal] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  // Filtering moved into CepStockAdder component

  const handleCreateBasket = async () => {
    if (!newBasket.cep_name) {
      setStatusModal({
        open: true,
        type: "error",
        title: "Missing name",
        message: "Please enter a basket name.",
      });
      return;
    }
    try {
      const created = await createCepBasket(newBasket).unwrap();
      setNewBasket({
        cep_name: "",
        methodologies: "",
        description: "",
        image_url: "",
        graph_lock_period: "",
        is_conservative: false,
        is_balanced: false,
        is_growth: false,
        is_aggressive: false,
        is_active: false,
      });
      setStatusModal({
        open: true,
        type: "success",
        title: "Basket created",
        message: `"${newBasket.cep_name}" has been created successfully${
          created?.id ? ` (ID: ${created.id})` : ""
        }.`,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Create basket failed", err);
      const apiMessage =
        err?.data?.message ||
        err?.error ||
        "Failed to create basket. Please try again.";
      setStatusModal({
        open: true,
        type: "error",
        title: "Creation failed",
        message: String(apiMessage),
      });
    }
  };

  const handleAddStock = async () => {
    if (
      !selectedBasket?.id ||
      !newStockId ||
      !volumeInput ||
      Number(volumeInput) <= 0
    ) {
      setStatusModal({
        open: true,
        type: "error",
        title: "Missing information",
        message: "Please select a basket, stock, and enter a valid volume.",
      });
      return;
    }

    const selectedStock = stocks.find(
      (s) => String(s.id) === String(newStockId)
    );
    const stockName = selectedStock?.stock_name || `Stock ID ${newStockId}`;

    try {
      await addStockToBasket({
        basketId: selectedBasket.id,
        stockId: newStockId,
        volume: Number(volumeInput),
        marketCap: Number(marketCap),
        basketWeight: Number(basketWeight),
        marketcapWeight: Number(marketcapWeight),
      }).unwrap();

      setNewStockId("");
      setVolumeInput("");
      setMarketCap(0);
      setBasketWeight(0);
      setMarketcapWeight(0);

      setStatusModal({
        open: true,
        type: "success",
        title: "Stock added",
        message: `"${stockName}" has been successfully added to "${selectedBasket.cep_name}" with volume ${volumeInput}.`,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Add stock failed", err);
      const apiMessage =
        err?.data?.message ||
        err?.error ||
        "Failed to add stock. Please try again.";
      setStatusModal({
        open: true,
        type: "error",
        title: "Add stock failed",
        message: String(apiMessage),
      });
    }
  };

  const handleRemoveStock = async (stockId) => {
    if (!selectedBasket?.id) return;
    try {
      await removeStockFromBasket({
        basketId: selectedBasket.id,
        stockId,
      }).unwrap();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Remove stock failed", err);
    }
  };

  const handleVolumeChange = (stockId, newVolume) => {
    if (!selectedBasket) return;
    const updated = { ...selectedBasket };
    const stockToUpdate = (updated.cep_stock || []).find(
      (s) => s.stock_id === stockId
    );
    if (stockToUpdate) {
      stockToUpdate.volume = Number(newVolume);
      setSelectedBasket(updated);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedBasket?.id) return;
    try {
      await updateCepBasket({
        basketId: selectedBasket.id,
        body: selectedBasket,
      }).unwrap();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Update basket failed", err);
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files && e.target.files[0];
    setFile(uploadedFile || null);
  };

  const handleBulkImport = async () => {
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const updates = jsonData.map((row) => ({
          basketName: row["Basket Name"],
          stockSymbol: row["Stock Symbol"],
          volume: Number(row.Volume),
        }));
        await bulkUpdateCepBaskets(updates).unwrap();
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Bulk update failed", err);
    }
  };

  if (isLoadingBaskets || isLoadingStocks) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${containerBg}`}
      >
        <Header category="Page" title="CEP Basket Manager" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (basketsError || stocksError) {
    return (
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${containerBg}`}
      >
        <Header category="Page" title="CEP Basket Manager" />
        <EmptyState
          title="Unable to Load CEP Baskets"
          message="We encountered an issue while loading the CEP baskets. Please try refreshing the page or contact support if the problem persists."
          buttonText="Refresh Page"
          variant="error"
        />
      </div>
    );
  }

  return (
    <div className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${containerBg}`}>
      <Header category="Page" title="CEP Basket Manager" />

      <CepCreateBasketForm
        newBasket={newBasket}
        onChange={setNewBasket}
        onSubmit={handleCreateBasket}
        isSubmitting={isCreating}
      />

      <div className="mb-5">
        <label className="text-base font-bold mr-3">Selected Basket:</label>
        <div className="inline-flex items-center gap-3">
          <div
            className={`px-3 py-2 rounded-md ${
              isDark
                ? "bg-gradient-to-br from-black via-slate-900 to-black text-white border border-gray-700/60"
                : "bg-white text-gray-900 border border-gray-300"
            }`}
          >
            {selectedBasket
              ? selectedBasket.cep_name
              : "Your selected basket will appear here"}
          </div>
          <button
            type="button"
            className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setPickerOpen(true)}
          >
            Select Basket
          </button>
        </div>
      </div>

      {selectedBasket && (
        <div>
          <h2 className="text-2xl font-bold mt-5 mb-3">
            Basket: {selectedBasket.cep_name}
          </h2>

          <CepStockAdder
            stocks={stocks}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedExchange={selectedExchange}
            setSelectedExchange={setSelectedExchange}
            newStockId={newStockId}
            setNewStockId={setNewStockId}
            volumeInput={volumeInput}
            setVolumeInput={setVolumeInput}
            marketCap={marketCap}
            setMarketCap={setMarketCap}
            marketcapWeight={marketcapWeight}
            setMarketcapWeight={setMarketcapWeight}
            basketWeight={basketWeight}
            setBasketWeight={setBasketWeight}
            onAdd={handleAddStock}
            adding={isAdding}
          />

          <CepStockTable
            selectedBasket={selectedBasket}
            onVolumeChange={handleVolumeChange}
            onRemove={handleRemoveStock}
            removing={isRemoving}
          />

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={isUpdating}
              className={`p-2 px-4 text-white rounded-md transition-all duration-200 ${
                isUpdating ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>

            {/* Custom File Upload */}
            <div className="relative">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer
                  transition-all duration-200 border-2 border-dashed
                  ${
                    isDark
                      ? "bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-cyan-500/50 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-600/30"
                      : "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-300 text-cyan-700 hover:border-cyan-400 hover:bg-cyan-100"
                  }
                `}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {file ? (
                  <span className="text-sm font-medium">📄 {file.name}</span>
                ) : (
                  <span className="text-sm font-medium">Choose Excel File</span>
                )}
              </label>
            </div>

            <button
              type="button"
              onClick={handleBulkImport}
              disabled={isBulkUpdating || !file}
              className={`p-2 px-4 text-white rounded-md transition-all duration-200 ${(() => {
                if (isBulkUpdating) return "bg-purple-400";
                if (!file) return "bg-gray-500 cursor-not-allowed";
                return "bg-purple-600 hover:bg-purple-700";
              })()}`}
            >
              {isBulkUpdating ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Bulk Import"
              )}
            </button>
          </div>
        </div>
      )}

      <BasketPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        baskets={baskets}
        initialSelectedId={selectedBasketId}
        onSelect={(id) => setSelectedBasketId(id)}
      />

      <StatusModal
        isOpen={statusModal.open}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => setStatusModal((s) => ({ ...s, open: false }))}
      />
    </div>
  );
};

export default CepBasketPage;
