import { ReactElement, useState } from 'react';
import { Detail, Icons, List } from "@project-gauntlet/api/components";

export default function Search(): ReactElement {
    const [searchDictWord, setSearchDictWord] = useState<string | undefined>("");
    const [words, setWords] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = (value: string | undefined) => {
        console.log(`Searching for: ${value}`);
        setSearchDictWord(value);
        if (value) {
            setIsLoading(true);
            fetch(`https://api.datamuse.com/words?sp=${value}*`)
                .then(response => response.json())
                .then(data => setWords(data.map((item: any) => item.word)))
                .catch(error => {
                    console.error(`Failed to fetch words:`, error);
                })
                .finally(() => setIsLoading(false));
        } else {
            setWords([]);
        }
    }

    const [id, setId] = useState<string | undefined>("")

    return (
        <List onItemFocusChange={setId} isLoading={isLoading}>
            <List.SearchBar
                placeholder="Search for a word..."
                value={searchDictWord}
                onChange={handleSearch}
            />
            {searchDictWord && words.length > 0 ? (
                words.slice(0, 10).map(word => (
                    <List.Item id={word} title={word} key={word} />
                ))
            ) : (
                null
            )}

            {isLoading ? (
                <List.EmptyView title='Searching...' />
            ) : !searchDictWord ? (
                <List.EmptyView title={`Search for word meanings`} />
            ) : (
                <List.EmptyView title='No results :(' image={Icons.Stop} />
            )}

            {searchDictWord && words.length > 0 && (
                <List.Detail>
                    <List.Detail.Content>
                        <List.Detail.Content.H4>
                            {id}
                        </List.Detail.Content.H4>
                    </List.Detail.Content>
                </List.Detail>
            )}
        </List>
    );
};

