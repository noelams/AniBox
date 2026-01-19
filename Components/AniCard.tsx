import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../Constants/Colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AniCardProps } from "../Types/animedata.types";
import { HomeStackParamList } from "../Types/navigation.types";

const AniCard = ({ title, image, id }: AniCardProps) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const handleNavigate = () => {
    navigation.navigate("AniDetails", { id });
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <Image source={{ uri: image }} style={styles.img} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AniCard;

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 200,
    alignItems: "center",
    marginHorizontal: 10,
  },
  img: {
    width: "100%",
    resizeMode: "cover",
    borderRadius: 20,
    height: 150,
  },
  title: {
    color: Colors.secondary,
    textAlign: "center",
    fontSize: 10,
  },
});

details: [
  {
    id: 30230,
    title: "Diamond no Ace: Second Season",
    main_picture: {
      medium: "https://cdn.myanimelist.net/images/anime/9/74398.webp",
      large: "https://cdn.myanimelist.net/images/anime/9/74398l.webp",
    },
    alternative_titles: {
      synonyms: [
        "Daiya no Ace: Second Season",
        "Ace of the Diamond: 2nd Season",
      ],
      en: "Ace of Diamond: Second Season",
      ja: "ダイヤのA[エース]～Second Season～",
    },
    start_date: "2015-04-06",
    end_date: "2016-03-28",
    synopsis:
      'After the National Tournament, the Seidou High baseball team moves forward with uncertainty as the Fall season quickly approaches. In an attempt to build a stronger team centered around their new captain, fresh faces join the starting roster for the very first time. Previous losses weigh heavily on the minds of the veteran players as they continue their rigorous training, preparing for what will inevitably be their toughest season yet.\n \nRivals both new and old stand in their path as Seidou once again climbs their way toward the top, one game at a time. Needed now more than ever before, Furuya and Eijun must be determined to pitch with all their skill and strength in order to lead their team to victory. And this time, one of these young pitchers may finally claim that coveted title: "The Ace of Seidou."\n\n[Written by MAL Rewrite]',
    mean: 8.3,
    rank: 278,
    popularity: 1704,
    num_list_users: 143363,
    num_scoring_users: 79614,
    nsfw: "white",
    created_at: "2015-03-02T06:03:11+00:00",
    updated_at: "2023-01-17T04:03:53+00:00",
    media_type: "tv",
    status: "finished_airing",
    genres: [
      {
        id: 23,
        name: "School",
      },
      {
        id: 27,
        name: "Shounen",
      },
      {
        id: 30,
        name: "Sports",
      },
      {
        id: 77,
        name: "Team Sports",
      },
    ],
    num_episodes: 51,
    start_season: {
      year: 2015,
      season: "spring",
    },
    broadcast: {
      day_of_the_week: "monday",
      start_time: "18:00",
    },
    source: "manga",
    average_episode_duration: 1440,
    rating: "pg_13",
    pictures: [
      {
        medium: "https://cdn.myanimelist.net/images/anime/3/73625.jpg",
        large: "https://cdn.myanimelist.net/images/anime/3/73625l.jpg",
      },
      {
        medium: "https://cdn.myanimelist.net/images/anime/9/74398.jpg",
        large: "https://cdn.myanimelist.net/images/anime/9/74398l.jpg",
      },
    ],
    background: "",
    related_anime: [
      {
        node: {
          id: 18689,
          title: "Diamond no Ace",
          main_picture: {
            medium: "https://cdn.myanimelist.net/images/anime/5/54235.jpg",
            large: "https://cdn.myanimelist.net/images/anime/5/54235l.jpg",
          },
        },
        relation_type: "prequel",
        relation_type_formatted: "Prequel",
      },
      {
        node: {
          id: 34349,
          title: "Diamond no Ace: Second Season OVA",
          main_picture: {
            medium: "https://cdn.myanimelist.net/images/anime/12/83218.webp",
            large: "https://cdn.myanimelist.net/images/anime/12/83218l.webp",
          },
        },
        relation_type: "side_story",
        relation_type_formatted: "Side story",
      },
      {
        node: {
          id: 38731,
          title: "Diamond no Ace: Act II",
          main_picture: {
            medium: "https://cdn.myanimelist.net/images/anime/1153/100511.jpg",
            large: "https://cdn.myanimelist.net/images/anime/1153/100511l.jpg",
          },
        },
        relation_type: "sequel",
        relation_type_formatted: "Sequel",
      },
    ],
    related_manga: [],
    recommendations: [
      {
        node: {
          id: 28891,
          title: "Haikyuu!! Second Season",
          main_picture: {
            medium: "https://cdn.myanimelist.net/images/anime/9/76662.webp",
            large: "https://cdn.myanimelist.net/images/anime/9/76662l.webp",
          },
        },
        num_recommendations: 4,
      },
      {
        node: {
          id: 20583,
          title: "Haikyuu!!",
          main_picture: {
            medium: "https://cdn.myanimelist.net/images/anime/7/76014.webp",
            large: "https://cdn.myanimelist.net/images/anime/7/76014l.webp",
          },
        },
        num_recommendations: 2,
      },
      {
        node: {
          id: 2159,
          title: "Ookiku Furikabutte",
          main_picture: {
            medium: "https://cdn.myanimelist.net/images/anime/2/20751.jpg",
            large: "https://cdn.myanimelist.net/images/anime/2/20751l.jpg",
          },
        },
        num_recommendations: 1,
      },
      {
        node: {
          id: 5941,
          title: "Cross Game",
          main_picture: {
            medium: "https://cdn.myanimelist.net/images/anime/6/22103.webp",
            large: "https://cdn.myanimelist.net/images/anime/6/22103l.webp",
          },
        },
        num_recommendations: 1,
      },
      {
        node: {
          id: 18179,
          title: "Yowamushi Pedal",
          main_picture: {
            medium: "https://cdn.myanimelist.net/images/anime/5/53211.webp",
            large: "https://cdn.myanimelist.net/images/anime/5/53211l.webp",
          },
        },
        num_recommendations: 1,
      },
      {
        node: {
          id: 16894,
          title: "Kuroko no Basket 2nd Season",
          main_picture: {
            medium: "https://cdn.myanimelist.net/images/anime/9/56155.webp",
            large: "https://cdn.myanimelist.net/images/anime/9/56155l.webp",
          },
        },
        num_recommendations: 1,
      },
      {
        node: {
          id: 24415,
          title: "Kuroko no Basket 3rd Season",
          main_picture: {
            medium: "https://cdn.myanimelist.net/images/anime/4/68299.webp",
            large: "https://cdn.myanimelist.net/images/anime/4/68299l.webp",
          },
        },
        num_recommendations: 1,
      },
      {
        node: {
          id: 32494,
          title: "Days",
          main_picture: {
            medium: "https://cdn.myanimelist.net/images/anime/11/88507.webp",
            large: "https://cdn.myanimelist.net/images/anime/11/88507l.webp",
          },
        },
        num_recommendations: 1,
      },
      {
        node: {
          id: 32935,
          title: "Haikyuu!! Karasuno Koukou vs. Shiratorizawa Gakuen Koukou",
          main_picture: {
            medium: "https://cdn.myanimelist.net/images/anime/7/81992.jpg",
            large: "https://cdn.myanimelist.net/images/anime/7/81992l.jpg",
          },
        },
        num_recommendations: 1,
      },
      {
        node: {
          id: 5040,
          title: "One Outs",
          main_picture: {
            medium: "https://cdn.myanimelist.net/images/anime/7/21065.jpg",
            large: "https://cdn.myanimelist.net/images/anime/7/21065l.jpg",
          },
        },
        num_recommendations: 1,
      },
    ],
    studios: [
      {
        id: 10,
        name: "Production I.G",
      },
      {
        id: 11,
        name: "Madhouse",
      },
    ],
    statistics: {
      status: {
        watching: "10746",
        completed: "101957",
        on_hold: "4607",
        dropped: "2846",
        plan_to_watch: "23204",
      },
      num_list_users: 143360,
    },
  },
];
