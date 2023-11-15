import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { gql, useMutation, useQuery } from "@apollo/client";
import { GET_REPORT_DETAILS, GET_REPORTS } from "../config/queries";
import Loading from "../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Foundation } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import alertErrors from "../utils/alertErrors";

const ADD_VOTE = gql`
  mutation Mutation($newVote: VoteInput!) {
    createVote(newVote: $newVote) {
      ReportId
      UserId
      comment
      id
      # image
      status
    }
  }
`;

const EDIT_VOTE = gql`
  mutation Mutation($newVote: VoteInput!) {
    editVote(newVote: $newVote) {
      ReportId
      UserId
      comment
      id
      # image
      status
    }
  }
`;

const GET_VOTEBYID = gql`
  query VoteByReport($voteByReportId: ID!) {
    voteByReport(id: $voteByReportId) {
      id
      UserId
      comment
      status
      User {
        name
      }
    }
  }
`;

export default function ReportDetailsScreen({ params, location, setLocation }) {
  console.log(params);
  const navigation = useNavigation();
  const id = params;
  const [access_token, setAccessToken] = useState("");

  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [userId, setUserId] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_REPORT_DETAILS, {
    variables: {
      reportId: id,
    },
  });

  const {
    loading: loadingVote,
    error: errorVote,
    data: dataVote,
    refetch: refetchDataVote,
  } = useQuery(GET_VOTEBYID, {
    variables: {
      voteByReportId: id,
    },
  });
  let hasVoted = dataVote?.voteByReport?.find(
    (item) => +item.UserId === +userId
  );
  const likes =
    dataVote?.voteByReport?.filter((v) => v.status === "like")?.length || 0;
  const dislikes =
    dataVote?.voteByReport?.filter((v) => v.status === "dislike")?.length || 0;

  const [funcCreateVote, { data: vote, loadingm, error: voteError }] =
    useMutation(ADD_VOTE, {
      refetchQueries: [GET_REPORT_DETAILS, GET_VOTEBYID, GET_REPORTS],
      context: {
        headers: {
          access_token: access_token,
        },
      },
      onCompleted: () => {
        setComment("");
        setStatus("");
      },
      onError: (err) => {
        console.log(err);
        alertErrors(err);
      },
    });

  const [funcEditVote, { data: voteEdit, loadingEdit, error: voteEditError }] =
    useMutation(EDIT_VOTE, {
      refetchQueries: [GET_REPORT_DETAILS, GET_VOTEBYID, GET_REPORTS],
      context: {
        headers: {
          access_token: access_token,
        },
      },
      onCompleted: () => {
        setComment("");
        setStatus("");
        setIsEdit(false);
      },
      onError: (err) => {
        console.log(err);
        alertErrors(err);
      },
    });

  const submitLike = () => {
    const payload = { ReportId: id, comment, status: "like" };
    console.log(payload, "<<<<<< PAYLOAD LIKE");
    if (isEdit) {
      let idVote = dataVote?.voteByReport.find(
        (item) => +item.UserId === +userId
      ).id;
      payload.id = idVote;
      funcEditVote({
        variables: {
          newVote: payload,
        },
      });
    } else {
      funcCreateVote({
        variables: {
          newVote: payload,
        },
      });
    }
  };
  const submitDislike = () => {
    const payload = { ReportId: id, comment, status: "dislike" };
    console.log(payload, "<<<<<< PAYLOAD DISLIKE");

    if (isEdit) {
      let idVote = dataVote?.voteByReport.find(
        (item) => +item.UserId === +userId
      ).id;
      payload.id = idVote;
      funcEditVote({
        variables: {
          newVote: payload,
        },
      });
    } else {
      funcCreateVote({
        variables: {
          newVote: payload,
        },
      });
    }
  };

  const funcAccessToken = async () => {
    try {
      const getAccessToken = await AsyncStorage.getItem("access_token");
      setAccessToken(getAccessToken);
      const getUserId = await AsyncStorage.getItem("id");
      setUserId(getUserId);
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      funcAccessToken();
      if (data && !loading) {
        refetch();
      }

      if (dataVote && !loadingVote) {
        refetchDataVote();
      }
    }, [])
  );

  const toLogin = async () => {
    navigation.navigate("Login");
  };

  const DateFormatter = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      // hour: "numeric",
      // minute: "numeric",
      // second: "numeric",
    };
    const isoDateString = date;
    const newDate = new Date(isoDateString);
    return new Intl.DateTimeFormat("id-ID", options).format(newDate);
  };

  const report = data?.report;
  const allVotes = dataVote?.voteByReport;
  console.log(allVotes, "votes");

  return (
    <SafeAreaView style={styles.container}>
      {loading || loadingm || loadingVote ? (
        <View style={{ height: "100%" }}>
          <Loading />
        </View>
      ) : (
        <ScrollView
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View>
            <Image
              style={styles.image}
              source={{
                uri: report.mainImage || "https://via.placeholder.com/150",
              }}
            />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <View style={styles.box}>
              <Text style={[styles.textLarge, styles.textSizeLarge]}>
                {report.title}
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginVertical: 8,
                }}
              >
                <View style={{ flex: 0.55 }}>
                  <Ionicons
                    name="ios-location-sharp"
                    size={18}
                    color="#015C92"
                  />
                </View>
                <View style={{ flex: 6 }}>
                  <Text style={[styles.textMedium, styles.textSizeSmall]}>
                    {report.location}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginVertical: 8,
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Ionicons name="person" size={18} color="#015C92" />
                <Text style={[styles.textMedium, styles.textSizeSmall]}>
                  Reported by: {report?.User?.name}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginVertical: 8,
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="date-range" size={18} color="#015C92" />
                <Text style={[styles.textMedium, styles.textSizeSmall]}>
                  {DateFormatter(report.createdAt)}
                </Text>
              </View>
              <Text
                style={[
                  styles.textMedium,
                  styles.textSizeLarge,
                  {
                    backgroundColor: "#fff",
                    padding: 12,
                    borderRadius: 10,
                    elevation: 2,
                    marginVertical: 20,
                  },
                ]}
              >
                {report.description}
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  marginVertical: 10,
                  justifyContent: "flex-end",
                }}
              >
                <View style={styles.badge}>
                  <Foundation name="like" size={20} color="#015C92" />
                  <Text>Helpful ({likes})</Text>
                </View>
                <View style={styles.badge}>
                  <Foundation name="dislike" size={20} color="#015C92" />
                  <Text>Not Helpful ({dislikes})</Text>
                </View>
              </View>
              <View>
                {access_token ? (
                  <View>
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          // console.log(
                          //   data.report.latitude,
                          //   data.report.longitude
                          // );
                          navigation.navigate("Dashboard");
                          setLocation({
                            coords: {
                              latitude: +data.report.latitude,
                              longitude: +data.report.longitude,
                            },
                          });
                        }}
                        style={[
                          styles.editVote,
                          { backgroundColor: "#015C92" },
                        ]}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 19,
                            fontWeight: "500",
                          }}
                        >
                          See Location!
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {hasVoted && !isEdit ? (
                      <View>
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              let comment = dataVote?.voteByReport.find(
                                (item) => +item.UserId === +userId
                              ).comment;
                              setComment(comment);
                              setIsEdit(true);
                              console.log(isEdit);
                            }}
                            style={[
                              styles.editVote,
                              { backgroundColor: "#088395" },
                            ]}
                          >
                            <Text
                              style={{
                                color: "#fff",
                                fontSize: 19,
                                fontWeight: "500",
                              }}
                            >
                              Edit your votes!
                            </Text>
                          </TouchableOpacity>
                          <Text
                            style={{
                              textAlign: "center",
                              marginVertical: 15,
                              fontWeight: "500",
                            }}
                          >
                            Thanks for your feedback!
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View>
                        <TextInput
                          style={styles.input}
                          onChangeText={setComment}
                          value={comment}
                          multiline={true}
                          numberOfLines={3}
                          underlineColorAndroid="transparent"
                          underlineColor="transparent"
                          placeholder="Comment"
                        />
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 12,
                            justifyContent: "flex-end",
                          }}
                        >
                          <TouchableOpacity
                            onPress={submitLike}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 5,
                              backgroundColor: "#088395",
                              padding: 8,
                              elevation: 1,
                              borderRadius: 10,
                            }}
                          >
                            <Foundation name="like" size={20} color="#fff" />
                            <Text style={{ color: "#fff" }}>Helpful</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={submitDislike}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 5,
                              backgroundColor: "#d11717",
                              padding: 8,
                              elevation: 1,
                              borderRadius: 10,
                            }}
                          >
                            <Foundation name="dislike" size={20} color="#fff" />
                            <Text style={{ color: "#fff" }}>Not Helpful</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                ) : (
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginVertical: 20,
                      flexDirection: "row",
                    }}
                  >
                    <Text style={[styles.textMedium, styles.textSizeMedium]}>
                      <Text>Please </Text>
                      <Text
                        style={[
                          styles.textMedium,
                          styles.textSizeMedium,
                          { color: "#015C92", paddingHorizontal: 10 },
                        ]}
                        onPress={() => toLogin()}
                      >
                        Login
                      </Text>
                      <Text> to leave a comment</Text>
                    </Text>
                  </View>
                )}
              </View>
              {allVotes && allVotes.length !== 0 && (
                <Text
                  style={[
                    styles.textMedium,
                    styles.textSizeMedium,
                    { marginLeft: 15 },
                  ]}
                >
                  Comment(s)
                </Text>
              )}
              <View
                style={{
                  borderRadius: 10,
                  display: "flex",
                  gap: 10,
                  padding: 10,
                }}
              >
                {allVotes
                  ?.slice()
                  .reverse()
                  .map((vote) => (
                    <View
                      key={vote?.id}
                      style={
                        vote.status === "like"
                          ? styles.userComment
                          : styles.userDislike
                      }
                    >
                      <Text
                        style={[
                          styles.textMedium,
                          styles.textSizeMedium,
                          { color: "#fff" },
                        ]}
                      >
                        @{vote.User.name}
                      </Text>
                      <Text
                        style={[
                          styles.textMedium,
                          styles.textSizeMedium,
                          { color: "#fff" },
                        ]}
                      >
                        {vote.comment}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  backButton: {
    position: "absolute",
    padding: 6,
    top: 20,
    left: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 380,
    objectFit: "cover",
    flex: 1,
    borderRadius: 10,
  },
  userComment: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#088395",
    borderRadius: 10,
  },
  userDislike: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#d11717",
    borderRadius: 10,
  },
  box: {
    flex: 1,
    marginVertical: 20,
    height: "100%",
    paddingHorizontal: 8,
  },
  badge: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#015C92",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  textSmall: {
    fontWeight: "200",
  },
  textMedium: {
    fontWeight: "500",
  },
  textLarge: {
    fontWeight: "700",
  },
  textSizeSmall: {
    fontSize: 14,
  },
  textSizeMedium: {
    fontSize: 16,
  },
  textSizeLarge: {
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  input: {
    height: 100,
    width: "100%",
    marginVertical: 20,
    padding: 15,
    textAlignVertical: "top",
    backgroundColor: "#f0f6fa",
    borderRadius: 10,
    fontSize: 14,
    elevation: 1,
  },
  editVote: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 7,
    color: "#fff",
    marginBottom: 5,
  },
});
