import numeral from "numeral";
import { useUser } from "@clerk/clerk-expo";
import { useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import { PieChart } from "react-native-gifted-charts";
import { View, Text, ScrollView } from "react-native";
import { Receipt, Weight, Hash } from "lucide-react-native";

import Card from "@/components/ui/Card";
import { Pedido } from "@/types/Pedido";
import { Producto } from "@/types/Tablas";
import PedidoRepository from "@/repositories/PedidoRepository";
import TablasRepository from "@/repositories/TablasRepository";

const Resumen = () => {
  const { user } = useUser();
  const apiUrl = user?.publicMetadata.apiUrl as string;
  const choferId = user?.publicMetadata.choferId as number;
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function getPedidos() {
        const pedidosRepository = new PedidoRepository(apiUrl, choferId);
        const pedidos = await pedidosRepository.getPedidos();

        setPedidos(pedidos);
      }

      getPedidos();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      async function getProductos() {
        const tablasRepository = new TablasRepository(apiUrl);
        const tablaProductos = await tablasRepository.getProductos();
        setProductos(tablaProductos.productos);
      }

      getProductos();
    }, [])
  );

  const getReporte = () => {
    const pedidosEntregados = pedidos.filter(
      (pedido) => pedido.estado === "Entregado"
    );

    const ventaPorEnvase: Record<
      string,
      { producto: Producto; cantidad: number; total: number }
    > = {};

    pedidosEntregados.forEach((pedido) => {
      pedido.items.forEach((item) => {
        const producto = productos.find(
          (p) => p.id === item.idProducto
        ) as Producto;

        if (!ventaPorEnvase[producto.codigo]) {
          ventaPorEnvase[producto.codigo] = {
            producto,
            cantidad: item.cantidad,
            total: item.cantidad * item.precio,
          };
        } else {
          ventaPorEnvase[producto.codigo].cantidad =
            ventaPorEnvase[producto.codigo].cantidad + item.cantidad;
          ventaPorEnvase[producto.codigo].total =
            ventaPorEnvase[producto.codigo].total + item.cantidad * item.precio;
        }
      });
    });

    return ventaPorEnvase;
  };

  const getTotalVentaPesos = () => {
    return pedidos
      .filter((pedido) => pedido.estado === "Entregado")
      .reduce((acc, pedido) => {
        const totalPedido = pedido.items.reduce(
          (acc, item) => acc + item.cantidad * item.precio,
          0
        );
        return acc + totalPedido;
      }, 0);
  };

  const getVentaTotalKilos = () => {
    return pedidos
      .filter((pedido) => pedido.estado === "Entregado")
      .reduce((acc, pedido) => {
        const totalPedido = pedido.items.reduce((acc, item) => {
          const producto = productos.find(
            (producto) => producto.id === item.idProducto
          ) as Producto;
          return acc + item.cantidad * producto.kilos;
        }, 0);
        return acc + totalPedido;
      }, 0);
  };

  const getVentaTotalRealizada = () => {
    return pedidos.filter((pedido) => pedido.estado === "Entregado").length;
  };

  const efectividadVisita = () => {
    const pedidosVisitados = pedidos.filter((pedido) => pedido.visito).length;
    const pedidosEntregados = pedidos.filter(
      (pedido) => pedido.estado === "Entregado"
    ).length;

    return {
      pedidosVisitados,
      pedidosEntregados,
    };
  };

  const porcentajeDeVisita = () => {
    const pedidosTotales = pedidos.length;
    const pedidosVisitados = pedidos.filter((pedido) => pedido.visito).length;

    return {
      pedidosTotales,
      pedidosVisitados,
    };
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ScrollView style={{ flex: 1, backgroundColor: "transparent" }}>
        <Card>
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <View style={{ alignItems: "center" }}>
              <PieChart
                donut
                data={[
                  {
                    value: efectividadVisita().pedidosEntregados,
                    color: "#6c47ff",
                  },
                  {
                    value:
                      efectividadVisita().pedidosVisitados -
                        efectividadVisita().pedidosEntregados || 100,
                    color: "lightgray",
                  },
                ]}
                radius={55}
                innerRadius={35}
                centerLabelComponent={() => {
                  return (
                    <Text style={{ fontSize: 18 }}>
                      {numeral(
                        efectividadVisita().pedidosEntregados /
                          efectividadVisita().pedidosVisitados
                      ).format("0.00%") || "0.00%"}
                    </Text>
                  );
                }}
              />
              <Text style={{ marginTop: 5 }}>Efectividad de Visita</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <PieChart
                donut
                data={[
                  {
                    value: porcentajeDeVisita().pedidosVisitados,
                    color: "#6c47ff",
                  },
                  {
                    value:
                      porcentajeDeVisita().pedidosTotales -
                      porcentajeDeVisita().pedidosVisitados,
                    color: "lightgray",
                  },
                ]}
                radius={55}
                innerRadius={35}
                centerLabelComponent={() => {
                  return (
                    <Text style={{ fontSize: 18 }}>
                      {numeral(
                        porcentajeDeVisita().pedidosVisitados /
                          porcentajeDeVisita().pedidosTotales
                      ).format("0.00%")}
                    </Text>
                  );
                }}
              />
              <Text style={{ marginTop: 5 }}>% de Visitados</Text>
            </View>
          </View>
        </Card>
        <View style={{ height: 10 }} />
        <Card backgroundColor="#ffeef1">
          <Receipt size={36} color={"#6c47ff"} />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 15,
              marginBottom: 5,
            }}
          >
            {numeral(getTotalVentaPesos()).format("$0.0,")}
          </Text>
          <Text style={{ fontWeight: "500", color: "#95afc0" }}>
            Ventas Totales en $
          </Text>
        </Card>
        <View style={{ height: 10 }} />
        <Card backgroundColor="#fff2dc">
          <Weight size={36} color={"#6c47ff"} />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 15,
              marginBottom: 5,
            }}
          >
            {numeral(getVentaTotalKilos()).format("0,0.00")}
          </Text>
          <Text style={{ fontWeight: "500", color: "#95afc0" }}>
            Ventas Totales en Kilos
          </Text>
        </Card>
        <View style={{ height: 10 }} />
        <Card backgroundColor="#d8fae7">
          <Hash size={36} color={"#6c47ff"} />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 15,
              marginBottom: 5,
            }}
          >
            {numeral(getVentaTotalRealizada()).format("0,0")}
          </Text>
          <Text style={{ fontWeight: "500", color: "#95afc0" }}>
            Ventas Realizadas
          </Text>
        </Card>
        <View style={{ height: 10 }} />
        <View style={{ gap: 5 }}>
          {Object.entries(getReporte()).map(([key, value]) => (
            <Card size="small" key={key}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{ flex: 1 }}
                >{`${value.producto.codigo} - ${value.producto.descripcion}`}</Text>
                <Text style={{ flex: 0.25 }}>{`${value.cantidad}`}</Text>
                <Text style={{ flex: 0.5 }}>{`${numeral(value.total).format(
                  "$0.0,"
                )}`}</Text>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Resumen;
